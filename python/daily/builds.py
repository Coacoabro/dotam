#!/usr/bin/env python3

import time
import psycopg2
import boto3
import json
import requests
import os
import psutil
import copy
import traceback

from datetime import datetime, timezone
from dotenv import load_dotenv
from collections import Counter
from collections import defaultdict
from botocore.exceptions import ClientError
from botocore.config import Config
from concurrent.futures import ThreadPoolExecutor, as_completed, TimeoutError
from multiprocessing import Process, Queue

load_dotenv()


start_time = time.time()
utc_time = datetime.fromtimestamp(start_time, tz=timezone.utc)
hour = utc_time.hour

# Steam's Web API
API_KEY = os.environ.get('DOTA_API_KEY_A')
SEQ_URL = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistoryBySequenceNum/v1/?key=' + API_KEY + '&start_at_match_seq_num='    


# My Amazon Database
database_url = os.environ.get('DATABASE_URL')

# Getting all hero ids
conn = psycopg2.connect(database_url)
cur = conn.cursor()
cur.execute("SELECT hero_id from heroes;")
hero_ids = [row[0] for row in cur.fetchall()]
conn.close()

res = requests.get("https://dhpoqm1ofsbx7.cloudfront.net/patch.txt")
patch = res.text
# patch = 'test'

item_req = requests.get("https://www.dota2.com/datafeed/itemlist?language=english")
item_res = item_req.json()
item_list = item_res['result']['data']['itemabilities']

# S3 Bucket

config = Config(
    connect_timeout=5,
    read_timeout=60,
    retries={
        'max_attempts': 3,
        'mode': 'standard'
    }
)
s3 = boto3.client('s3', config=config)


# Telegram Stuff

BOT_TOKEN = "8073220272:AAGVRtXb7LRM0H4h3KizX5GfbfqLGDj6S1s"  # From BotFather
CHAT_ID = "529384584"  # From userinfobot

def send_telegram_message(bot_token, chat_id, message):
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message
    }
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        print("Telegram notification sent!")
    else:
        print(f"Failed to send Telegram message: {response.status_code} - {response.text}")

def actualRank(rank):
    if rank >= 80:
        return ["IMMORTAL", "HIGH"]
    elif rank >= 70:
        return ["DIVINE", "HIGH"]
    elif rank >= 60:
        return ["ANCIENT", "HIGH"]
    elif rank >= 50:
        return ["LEGEND", "MID"]
    elif rank >= 40:
        return ["ARCHON", "MID"]
    elif rank >= 30:
        return ["CRUSADER", "LOW"]
    elif rank >= 20:
        return ["GUARDIAN", "LOW"]
    else:
        return ["HERALD", "LOW"]

def getBuilds(ranked_matches, builds):

    global patch
    global facet_nums

    # Stratz API
    graphql_token = os.environ.get('NEXT_PUBLIC_REACT_APP_TOKEN')
    stratz_url = 'https://api.stratz.com/graphql' #GraphQL Endpoint
    stratz_headers = {'Authorization': f'Bearer {graphql_token}', 'User-Agent': 'STRATZ_API'}

    Boots = [48, 50, 63, 180, 214, 220, 231, 931] #Brown Boots ID is 29
    Support = [30, 40, 42, 43, 45, 188, 257, 286]
    Consumable = [38, 39, 44, 216, 241, 265, 4204, 4205, 4026]

    Early = [29, 34, 36, 41, 73, 75, 77, 88, 178, 181, 240, 244, 569]
    Stackable = [73, 75, 77]
    SupportFull = [37, 79, 90, 92, 102, 226, 231, 254, 269, 1128]
    FullItems = [1, 48, 50, 63, 65, 81, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114,
                116, 119, 121, 123, 125, 127, 131, 133, 135, 137, 139, 141, 143, 145, 
                147, 149, 151, 152, 154, 156, 158, 160, 162, 164, 166, 168, 170, 172, 
                174, 176, 180, 185, 190, 193, 194, 196, 201, 202, 203, 204, 206, 208, 
                210, 214, 220, 223, 225, 226, 229, 231, 232, 235, 236, 242, 247, 249, 
                250, 252, 254, 256, 259, 263, 267, 269, 271, 273, 277, 534, 596, 598, 
                600, 603, 604, 609, 610, 635, 931, 939, 1097, 1107, 1466, 1806, 1808] 
    Swords = [162, 170, 259]

    NeutralTokens = [2091, 2092, 2093, 2094, 2095]
    FakeNeutrals = [1441] # So far the only one I see is Witch Doctors GrisGris

    KezTalents = [6299, 7132, 1511, 1509, 1510, 1516, 1514, 1513]

    fragment = """
        fragment MatchData on MatchType {
            actualRank
            players {
                position
                abilities {
                    abilityId
                    isTalent
                }
                stats {
                    itemPurchases {
                        itemId
                        time
                    }
                    inventoryReport {
                        neutral0 {
                            itemId
                        }
                    }
                }
            }
        }
    """

    matches_query = "\n".join([f"{'match_' + str(ranked_match['match_id'])}: match(id: {ranked_match['match_id']}) {{ ...MatchData }}" for ranked_match in ranked_matches])

    query = f"""
        query MyQuery {{
            {matches_query}
        }}
        {fragment}
    """

    tries = 0

    while tries < 3:
        try:
            response = requests.post(stratz_url, json={'query': query}, headers=stratz_headers, timeout=600)
            data = json.loads(response.text)
            break
        except:
            print(f"Got nothing, trying again in 1 minute ({3-tries} tries left)")
            time.sleep(60)
            tries += 1

    for ranked_match in ranked_matches:
        match_id = ranked_match['match_id']
        # print(data)
        gqlmatch = data['data']['match_' + str(match_id)]
        if gqlmatch:
            rank = actualRank(gqlmatch['actualRank'])
            players = gqlmatch['players']
            for n, player in enumerate(players):
                if player['stats']:
                    purchasedItems = player['stats']['itemPurchases']
                    neutralEvents = player['stats']['inventoryReport']
                    if purchasedItems:
                        hero_id = ranked_match['players'][n]['id']
                        role = player['position']
                        facet = ranked_match['players'][n]['facet']
                        win = ranked_match['players'][n]['won']

                        if facet in facet_nums[str(hero_id)]:
                            facet = facet_nums[str(hero_id)].index(facet) + 1
                            abilityEvents = player['abilities']
                            abilities = []
                            talents = []

                            for ability in abilityEvents:
                                abilityId = ability['abilityId']
                                if abilityId != 730 and len(talents) < 4:

                                    # FOR KEZ, UPDATE TALENTS LATER
                                    
                                    if hero_id == 145:
                                        if abilityId in KezTalents:
                                            talents.append(abilityId)
                                            if len(abilities) < 16:
                                                abilities.append(-1)
                                        elif len(abilities) < 16:
                                            if abilityId == 1502:
                                                abilities.append(1498)
                                            elif abilityId == 1503:
                                                abilities.append(1499)
                                            elif abilityId == 1504:
                                                abilities.append(1500)
                                            elif abilityId == 1506:
                                                abilities.append(1501)
                                            else:
                                                abilities.append(abilityId)

                                    else:
                                        if ability['isTalent'] and ability['abilityId'] not in talents:
                                            talents.append(ability['abilityId'])
                                            if len(abilities) < 16:
                                                abilities.append(-1)
                                        elif len(abilities) < 16:
                                            abilities.append(ability['abilityId'])

                            # If a hero hits level 16 at least then we should have enough info for items and what not
                            if len(abilities) == 16:
                                isSupport = False
                                if role == 'POSITION_4' or role == 'POSITION_5':
                                    isSupport = True

                                # Starting Game Items
                                startingItems = []
                                for staritem in purchasedItems:
                                    item_id = staritem['itemId']
                                    if staritem['time'] < 0 and len(startingItems) < 6:
                                        startingItems.append(item_id)
                                startingItems = sorted(startingItems)

                                # Early Game Items
                                earlyItems = []
                                tempItemArray = []
                                secondItems = []
                                for earlitem in purchasedItems:
                                    item_id = earlitem['itemId']
                                    if earlitem['time'] < 900 and item_id in Early:
                                        secondPurchase = False
                                        if item_id in tempItemArray:
                                            if item_id in Stackable:
                                                secondPurchase = True
                                            else:
                                                secondItems.append(item_id)
                                        if item_id not in secondItems:
                                            tempItemArray.append(item_id)
                                            earlyItems.append({'Item': item_id, 'isSecondPurchase': secondPurchase})
                                        if secondPurchase:
                                            secondItems.append(item_id)

                                # Generating Core Items and Full Items Purchased Order
                                itemBuild = []
                                for item in purchasedItems:
                                    if item['itemId'] not in itemBuild:
                                        isSecondSword = False
                                        if item['itemId'] in Swords:
                                            if itemBuild and itemBuild[-1] in Swords:
                                                isSecondSword = True
                                        if isSecondSword == False:
                                            if isSupport == True:
                                                if item['itemId'] in SupportFull or item['itemId'] in FullItems:
                                                    itemBuild.append(item['itemId'])
                                            else:
                                                if item['itemId'] in FullItems:
                                                    itemBuild.append(item['itemId'])

                                if len(itemBuild) >= 2 and isSupport == True:
                                    core = itemBuild[:2]
                                elif len(itemBuild) >= 3 and isSupport == False:
                                    core = itemBuild[:3]
                                else:
                                    core = None
                                
                                # Neutral Items
                                neutralItems = []
                                for neutralEvent in neutralEvents:
                                    if neutralEvent['neutral0'] != None:
                                        neutral = neutralEvent['neutral0']['itemId']
                                        if neutral not in neutralItems and neutral not in NeutralTokens and neutral not in FakeNeutrals:
                                            tier = None
                                            for item_info in item_list:
                                                if item_info['id'] == neutral:
                                                    tier = item_info['neutral_item_tier'] + 1
                                                    break
                                            neutralItems.append({'Item': neutral, 'Tier': tier})
                                
                                if core:
                                    # Dump into builds

                                    for rank_value in [rank[0], rank[1], ""]:
                                        key = (hero_id, rank_value, role, facet)
                                        hero_build = builds.get(key)
                                        if hero_build:

                                            # Matches and Wins
                                            hero_build[4] += 1
                                            hero_build[5] += win
                                            
                                            # Abilities
                                            abilityBuild = hero_build[6].get(tuple(abilities))
                                            if abilityBuild:
                                                abilityBuild['Wins'] += win
                                                abilityBuild['Matches'] += 1
                                            else:
                                                hero_build[6][tuple(abilities)] = {'Wins': win, 'Matches': 1}
                                            
                                            # Talents
                                            for talent in talents:
                                                talentBuild = hero_build[7].get(talent)
                                                if talentBuild:
                                                    talentBuild['Wins'] += win
                                                    talentBuild['Matches'] += 1
                                                else:
                                                    hero_build[7][talent] = {'Wins': win, 'Matches': 1}

                                            # Starting Items                                            
                                            startingBuild = hero_build[8].get(tuple(startingItems))
                                            if startingBuild:
                                                startingBuild['Wins'] += win
                                                startingBuild['Matches'] += 1
                                            else:
                                                hero_build[8][tuple(startingItems)] = {'Wins': win, 'Matches': 1}

                                            # Early Items
                                            for earlyGameItem in earlyItems:
                                                earlyKey = (earlyGameItem['Item'], earlyGameItem['isSecondPurchase'])
                                                earlyItem = hero_build[9].get(earlyKey)
                                                if earlyItem:
                                                    earlyItem['Matches'] += 1
                                                    earlyItem['Wins'] += win
                                                else:
                                                    hero_build[9][earlyKey] = {'Wins': win, 'Matches': 1}

                                            # Core and Late Items
                                            m = 3 if isSupport else 4
                                            currentCore = hero_build[10].get(tuple(core))
                                            noCoreItems = itemBuild[(m-1):]
                                            if currentCore:
                                                currentCore['Wins'] += win
                                                currentCore['Matches'] += 1
                                                for _ in range(7):
                                                    if noCoreItems:
                                                        gameItem = noCoreItems.pop(0)
                                                        lateKey = (gameItem, m)
                                                        lateItem = currentCore['Late'].get(lateKey)
                                                        if lateItem:
                                                            lateItem['Wins'] += win
                                                            lateItem['Matches'] += 1
                                                        else:
                                                            currentCore['Late'][lateKey] = {'Wins': win, 'Matches': 1}
                                                        m += 1
                                            else:
                                                lateGameItems = {}
                                                for _ in range(7):
                                                    if noCoreItems:
                                                        gameItem = noCoreItems.pop(0)
                                                        lateKey = (gameItem, m)
                                                        lateGameItems[lateKey] = {'Wins': win, 'Matches': 1}
                                                    m += 1
                                                hero_build[10][tuple(core)] = {'Wins': win, 'Matches': 1, 'Late': lateGameItems}

                                            # Neutral Items
                                            seen = set()
                                            for neutralItem in neutralItems:
                                                item_id = neutralItem['Item']
                                                if item_id in seen:
                                                    continue
                                                else:
                                                    currNeutral = hero_build[11].get(item_id)
                                                    seen.add(item_id)
                                                    if currNeutral:
                                                        currNeutral['Wins'] += win
                                                        currNeutral['Matches'] += 1
                                                    else:
                                                        hero_build[11][item_id] = {'Tier': neutralItem['Tier'], 'Wins': win, 'Matches': 1}


                                        else:
                                            finalAbilities = {}
                                            finalAbilities[tuple(abilities)] = {'Wins': win, 'Matches': 1}
                                            finalTalents = {}
                                            for finalTalent in talents:
                                                finalTalents[finalTalent] = {'Wins': win, 'Matches': 1}
                                            finalStarting = {}
                                            finalStarting[tuple(startingItems)] = {'Wins': win, 'Matches': 1}
                                            finalEarlyItems = {}
                                            for tempEarlyItem in earlyItems:
                                                finalEarlyItems[(tempEarlyItem['Item'], tempEarlyItem['isSecondPurchase'])] = {'Wins': win, 'Matches': 1}
                                            finalCoreItems = {}
                                            lateGameItems = {}
                                            m = 3 if isSupport else 4
                                            finalNoCore = itemBuild[(m-1):]
                                            for _ in range(7):
                                                if finalNoCore:
                                                    gameItem = finalNoCore.pop(0)
                                                    lateKey = (gameItem, m)
                                                    lateGameItems[lateKey] = {'Wins': win, 'Matches': 1}
                                                m += 1
                                            finalCoreItems[tuple(core)] = {'Wins': win, 'Matches': 1, 'Late': lateGameItems}
                                            finalNeutrals = {}
                                            if len(neutralItems) > 0:
                                                for finalNeutralItem in neutralItems:
                                                    finalNeutrals[finalNeutralItem['Item']] = {'Tier': finalNeutralItem['Tier'], 'Wins': win, 'Matches': 1}

                                            tempBuild = [hero_id, rank_value, role, facet, 1, win, finalAbilities, finalTalents, 
                                                         finalStarting, finalEarlyItems, finalCoreItems, finalNeutrals]
                                            
                                            builds[(hero_id, rank_value, role, facet)] = tempBuild

    return builds

def mergebuilds(existing: dict, new: dict):
    for key, value in new.items():
        if key in existing:
            existing[key]['Wins'] += value['Wins']
            existing[key]['Matches'] += value['Matches']
        else:
            existing[key] = value.copy()
    return existing

def process_build(builds, hero_id, rank):
    
    global patch

    if not rank:
        rank = ""
    
    # Grabbing Summary for Wins and Matches
    s3_summary_key = f"data/{patch}/{hero_id}/{rank}/summary.json"
    summary_obj = s3.get_object(Bucket='dotam-builds', Key=s3_summary_key)
    s3_summary = json.loads(summary_obj['Body'].read().decode('utf-8'))

    # Grabbing Data
    s3_data_key = f"data/{patch}/{hero_id}/{rank}/data.json"
    data_obj = s3.get_object(Bucket='dotam-builds', Key=s3_data_key)
    existing_data = json.loads(data_obj['Body'].read().decode('utf-8'))

    # Grabbing Abilities Page Info
    s3_abilities_key = f"data/{patch}/{hero_id}/{rank}/abilities.json"
    abilities_obj = s3.get_object(Bucket='dotam-builds', Key=s3_abilities_key)
    existing_abilities = json.loads(abilities_obj['Body'].read().decode('utf-8'))

    # Grabbing Items Page Info
    s3_items_key = f"data/{patch}/{hero_id}/{rank}/items.json"
    items_obj = s3.get_object(Bucket='dotam-builds', Key=s3_items_key)
    existing_items = json.loads(items_obj['Body'].read().decode('utf-8'))
    
    # Grabbing Build Page Info
    s3_builds_key = f"data/{patch}/{hero_id}/{rank}/builds.json"
    build_obj = s3.get_object(Bucket='dotam-builds', Key=s3_builds_key)
    existing_builds = json.loads(build_obj['Body'].read().decode('utf-8'))


    for build in builds:

        hero_id, rank, role, facet, total_matches, total_wins, abilities, talents, starting, early, core, neutrals = build

        if not rank:
            rank = ""
        
        lateStart = 4
        if role == "POSITION_4" or role == "POSITION_5":
            lateStart = 3

        s3_summary[role][str(facet)]["total_matches"] += total_matches
        s3_summary[role][str(facet)]["total_wins"] += total_wins
        
        new_build_data = [abilities, talents, starting, early, core, neutrals]

        existing_build_data = existing_data[role][str(facet)]

        if not existing_build_data:
            updated_abilities, updated_talents, updated_starting, updated_early, updated_core, updated_neutrals = new_build_data
            existing_data[role][str(facet)] = [updated_abilities, updated_talents, updated_starting, updated_early, updated_core, updated_neutrals]
        else:
            old_abilities, old_talents, old_starting, old_early, old_core, old_neutrals = existing_build_data

            abilities_dict = {tuple(d['Abilities']): {'Wins': d['Wins'], 'Matches': d['Matches']} for d in old_abilities}
            talents_dict = {d['Talent']: {'Wins': d['Wins'], 'Matches': d['Matches']} for d in old_talents}
            starting_dict = {tuple(d['Starting']): {'Wins': d['Wins'], 'Matches': d['Matches']} for d in old_starting}
            early_dict = {(d['Item'], d['isSecondPurchase']): {'Wins': d['Wins'], 'Matches': d['Matches']} for d in old_early}
            neutrals_dict = {d['Item']: {'Tier': d['Tier'], 'Wins': d['Wins'], 'Matches': d['Matches']} for d in old_neutrals}

            updated_abilities = mergebuilds(abilities_dict, abilities)
            updated_talents = mergebuilds(talents_dict, talents)
            updated_starting = mergebuilds(starting_dict, starting)
            updated_early = mergebuilds(early_dict, early)
            updated_neutrals = mergebuilds(neutrals_dict, neutrals)


            updated_core = {}
            for oc in old_core:
                old_late = {}
                for nth, items in oc["Late"].items():
                    for ol in items:
                        key = (ol['Item'], int(nth))
                        old_late[key] = {"Wins": ol["Wins"], "Matches": ol['Matches']}
                updated_core[tuple(oc["Core"])] = {
                    'Wins': oc["Wins"],
                    'Matches': oc['Matches'],
                    'Late': old_late
                }

            for key, value in core.items():
                if key not in updated_core:                    
                    updated_core[key] = {
                        'Wins': value['Wins'],
                        'Matches': value['Matches'],
                        'Late': dict(value.get('Late', {}))
                    }
                else:
                    updated_core[key]['Wins'] += value['Wins']
                    updated_core[key]['Matches'] += value['Matches']
                    
                    for (item_id, nth), stats in value.get('Late', {}).items():
                        late_key = (item_id, nth)
                        if late_key not in updated_core[key]['Late']:
                            updated_core[key]['Late'][late_key] = stats.copy()
                        else:
                            updated_core[key]['Late'][late_key]['Wins'] += stats['Wins']
                            updated_core[key]['Late'][late_key]['Matches'] += stats['Matches']
        
        
        # Organize Updated Builds for faster loading

        # Abilities Data
        top_abilities = sorted(updated_abilities.items(), key=lambda ta: (ta[1]["Matches"], ta[1]["Wins"]), reverse=True)
        abilities_json = [{'Abilities': list(k), **v} for k, v in top_abilities]
        talents_json = [{'Talent': k, **v} for k, v in updated_talents.items()]

        # Items Data
        top_starting = sorted(updated_starting.items(), key=lambda ts: (ts[1]["Matches"], ts[1]["Wins"]), reverse=True)
        top_early = sorted(updated_early.items(), key=lambda te: (te[1]["Matches"], te[1]["Wins"]), reverse=True)
        top_core = sorted(updated_core.items(), key=lambda tc: (tc[1]["Matches"], tc[1]["Wins"]), reverse=True)
        top_neutrals = sorted(updated_neutrals.items(), key=lambda tn: (tn[1]['Tier'], -tn[1]["Matches"], -tn[1]["Wins"]), reverse=False)
        
        
        for _, tc in top_core:
            grouped_by_nth = defaultdict(list)
            late_items = tc.get("Late", {})
            for (item_id, nth), stats in late_items.items():
                grouped_by_nth[nth].append({
                    'Item': item_id,
                    'Wins': stats['Wins'],
                    'Matches': stats['Matches']
                })
        
            for nth in grouped_by_nth:
                grouped_by_nth[nth].sort(key=lambda x: (x['Matches'], x['Wins']), reverse=True)
            
            tc["Late"] = dict(grouped_by_nth)
            


        starting_json = [{'Starting': list(k), **v} for k, v in top_starting]
        early_json = [
            {'Item': item_id, 'isSecondPurchase': is_second, 'Wins': stats['Wins'], 'Matches': stats['Matches']} 
            for (item_id, is_second), stats in top_early
                ]
        core_json = [{'Core': list(k), **v} for k, v in top_core]
        neutrals_json = [{'Item': k, **v} for k, v in top_neutrals]

        # Full Data, hopefully untouched when mutated later
        existing_data[role][str(facet)] = [abilities_json, talents_json, starting_json, early_json, core_json, neutrals_json]

        copied_core = copy.deepcopy(core_json[:10])

        for core_entry in copied_core:  # Only care about top 10 for items
            if "Late" in core_entry:
                for nth in core_entry["Late"]:
                    core_entry["Late"][nth] = core_entry["Late"][nth][:10]

        existing_abilities[role][str(facet)] = {
            "abilities": abilities_json[:10],
            "talents": talents_json
        }

        existing_items[role][str(facet)] = {
            "starting": starting_json[:5],
            "early": early_json[:10],
            "core": copied_core,
            "neutrals": neutrals_json
        }

        existing_builds[role][str(facet)] = {
            "abilities": abilities_json[0] if len(abilities_json) > 0 else None,
            "talents": talents_json,
            "items": {
                "starting": starting_json[0] if len(starting_json) > 0 else None,
                "early": early_json[:6] if len(early_json) > 0 else None,
                "core": copied_core[:3],
                "neutrals": neutrals_json
            }
        }  


    
    # Dumping Updated Summary
    s3.put_object(Bucket='dotam-builds', Key=s3_summary_key, Body=json.dumps(s3_summary, indent=None))    

    # Dumping Updated Build Data
    s3.put_object(Bucket='dotam-builds', Key=s3_data_key, Body=json.dumps(existing_data, indent=None))

    # Dumping Updated Abilities Page
    s3.put_object(Bucket='dotam-builds', Key=s3_abilities_key, Body=json.dumps(existing_abilities, indent=None))

    # Dumping Updated Items Page
    s3.put_object(Bucket='dotam-builds', Key=s3_items_key, Body=json.dumps(existing_items, indent=None))

    # Dumping Updated Builds Page
    s3.put_object(Bucket='dotam-builds', Key=s3_builds_key, Body=json.dumps(existing_builds, indent=None))

    print("DONE: ", hero_id, rank)



def worker(queue, build_group, hero_id, rank):
    try:
        process_build(build_group, hero_id, rank)
        queue.put("done")
    except Exception as e:
        queue.put(f"Error: {str(e)}")



def sendtos3(builds):

    grouped_builds = defaultdict(list)
    for (hero_id, rank, role, facet), build in builds.items():
        grouped_builds[(hero_id, rank)].append(build)

    print("Amount of builds: ", len(grouped_builds))


    # Thread Pool
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {
            executor.submit(process_build, build_group, hero_id, rank): (hero_id, rank)
            for (hero_id, rank), build_group in grouped_builds.items()
        }

        for future in as_completed(futures):
            hero_id, rank = futures[future]
            try:
                future.result(timeout=300)
            except TimeoutError:
                error_message = f"Timeout processing build for hero {hero_id} and rank {rank}"
                send_telegram_message(BOT_TOKEN, CHAT_ID, error_message)
            except Exception as e:
                error_message = f"Error processing build for hero {hero_id} and rank {rank}: {e}"
                send_telegram_message(BOT_TOKEN, CHAT_ID, error_message)

    ## Normal Testing, one by one
    # for (hero_id, rank), build_group in grouped_builds.items():
    #     process_build(build_group, hero_id, rank)

    ## Make Sure Everythings Up to Date
    client = boto3.client('cloudfront')
    response = client.create_invalidation(
        DistributionId='E3TU5F95XHEEA',  # Replace with your CloudFront Distribution ID
        InvalidationBatch={
            'Paths': {
                'Quantity': 1,  # Number of paths to invalidate
                'Items': [
                    '/*',  # Invalidate all files; use specific paths for individual files
                ]
            },
            'CallerReference': str(datetime.now())  # Unique string to prevent duplicate invalidations
        }
    )

    # Finished!
    print("Done. Last sequence num: ", seq_num)
    with open(file_path, 'w') as file:
        json.dump({"seq_num": seq_num}, file)

    end_time = time.time()
    elapsed_time = end_time - start_time

    time_message = f"Finished sending to S3. That took {round((elapsed_time/60), 2)} minutes"
    print(time_message)
    send_telegram_message(BOT_TOKEN, CHAT_ID, time_message)



file_path = '/home/ec2-user/dotam/python/daily/seq_num.json'
facet_path = '/home/ec2-user/dotam/python/daily/facet_nums.json'
# file_path = './python/daily/seq_num.json'
# facet_path = './python/daily/facet_nums.json'

with open(file_path, 'r') as file:
    data = json.load(file)
    seq_num = data['seq_num']

with open(facet_path, 'r') as file:
    facet_nums = json.load(file)



ranked_matches = []

hourlyDump = 0
builds = {}
build_index = {}

backoff = 5

sent_already = False

while True:
    try:
        
        DOTA_2_URL = SEQ_URL + str(seq_num)
        response = requests.get(DOTA_2_URL, timeout=600)

        if response.status_code == 200:
            backoff = 5
            matches = response.json()['result']['matches']
            for match in matches:
                seq_num = match['match_seq_num']
                if match['lobby_type'] == 7 and match['game_mode'] == 22:
                    ranked_match = {}
                    radiantWon = match['radiant_win']
                    ranked_match['match_id'] = match['match_id']
                    players = match['players']
                    i = 0
                    playersInfo = []
                    for player in players:
                        won = 0
                        if i < 5 and radiantWon:
                            won = 1
                        elif i > 4 and not radiantWon:
                            won = 1
                        i += 1
                        heroObj = {}
                        heroObj['id'] = player['hero_id']
                        heroObj['facet'] = player['hero_variant']
                        heroObj['won'] = won
                        playersInfo.append(heroObj)
                    ranked_match['players'] = playersInfo
                    ranked_matches.append(ranked_match)
                    if len(ranked_matches) == 100:
                        hourlyDump += 1
                        print(hourlyDump)
                        builds = getBuilds(ranked_matches, builds)
                        ranked_matches = []

        if hourlyDump >= 750:
            end_time = time.time()
            elapsed_time = end_time - start_time
            time_message = f"Sucessfully parsed data! Now sending to S3. That took {round((elapsed_time/60), 2)} minutes"
            print(time_message)
            send_telegram_message(BOT_TOKEN, CHAT_ID, time_message)

            sendtos3(builds)

            break

    except Exception as e:
        error_message = f"An error occurred in your script:\n\n{str(e)}"
        print(error_message)
        if str(e) == "local variable 'data' referenced before assignment":
            send_telegram_message(BOT_TOKEN, CHAT_ID, "Referenced before assignment, aborting mission")
            break
        else:
            send_telegram_message(BOT_TOKEN, CHAT_ID, error_message)
            if builds and not sent_already:
                sent_already = True
                sendtos3(builds)
        break