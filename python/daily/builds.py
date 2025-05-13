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
from concurrent.futures import ThreadPoolExecutor

load_dotenv()


start_time = time.time()
utc_time = datetime.fromtimestamp(start_time, tz=timezone.utc)
hour = utc_time.hour

# Steam's Web API
API_KEY = ""
if hour % 2 == 0:
    print("Even")
    API_KEY = os.environ.get('DOTA_API_KEY_K')
else:
    print("Odd")
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

item_req = requests.get("https://www.dota2.com/datafeed/itemlist?language=english")
item_res = item_req.json()
item_list = item_res['result']['data']['itemabilities']

# S3 Bucket

s3 = boto3.client('s3')


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
            print("Got the graphql data")
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
                                            neutralItems.append(neutral)
                                
                                if core:
                                    # Dump into builds

                                    for rank_value in [rank[0], rank[1], ""]:
                                        key = (hero_id, rank_value, role, facet)
                                        hero_build = builds.get(key)
                                        if hero_build:

                                            hero_build[4] += 1
                                            hero_build[5] += win                                            
                                            
                                            # print(f"{hero_build[0]} {hero_build[1]} {hero_build[2]} {hero_build[3]}: {hero_build[4]}")

                                            abilitiesFound = False
                                            currentAbilities = copy.deepcopy(hero_build[6])
                                            for abilityBuild in currentAbilities:
                                                if abilityBuild['Abilities'] == abilities:
                                                    abilityBuild['Wins'] += win
                                                    abilityBuild['Matches'] += 1
                                                    abilitiesFound = True
                                                    hero_build[6] = currentAbilities
                                                    break
                                            if not abilitiesFound:
                                                hero_build[6].append({'Abilities': abilities, 'Wins': win, 'Matches': 1})
                                            
                                            for talent in talents:
                                                talentFound = False
                                                currentTalents = copy.deepcopy(hero_build[7])
                                                for talentBuild in currentTalents:
                                                    if talentBuild['Talent'] == talent:
                                                        talentBuild['Wins'] += win
                                                        talentBuild['Matches'] += 1
                                                        talentFound = True
                                                        hero_build[7] = currentTalents
                                                        break
                                                if not talentFound:
                                                    hero_build[7].append({'Talent': talent, 'Wins': win, 'Matches': 1})

                                            startingFound = False
                                            currentStarting = copy.deepcopy(hero_build[8])
                                            for startingBuild in currentStarting:
                                                if sorted(startingBuild['Starting']) == sorted(startingItems):
                                                    startingBuild['Wins'] += win
                                                    startingBuild['Matches'] += 1
                                                    startingFound = True
                                                    hero_build[8] = currentStarting
                                                    break
                                            if not startingFound:
                                                hero_build[8].append({'Starting': sorted(startingItems), 'Wins': win, 'Matches': 1})

                                            currentEarly = copy.deepcopy(hero_build[9])
                                            for earlyGameItem in earlyItems:
                                                earlyFound = False
                                                for earlyItem in currentEarly:
                                                    if earlyItem['Item'] == earlyGameItem['Item'] and earlyItem['isSecondPurchase'] == earlyGameItem['isSecondPurchase']:
                                                        earlyItem['Matches'] += 1
                                                        earlyItem['Wins'] += win
                                                        earlyFound = True
                                                        hero_build[9] = currentEarly
                                                        break
                                                if not earlyFound:
                                                    hero_build[9].append({'Item': earlyGameItem['Item'], 'isSecondPurchase': earlyGameItem['isSecondPurchase'], 'Wins': win, 'Matches': 1})

                                            buildFound = False
                                            currentCore = copy.deepcopy(hero_build[10])
                                            for build in currentCore:
                                                if build['Core'] == core:
                                                    build['Wins'] += win
                                                    build['Matches'] += 1
                                                    m = 3 if isSupport else 4
                                                    for index in range(m-1, len(itemBuild)):
                                                        gameItem = itemBuild[index]
                                                        lateFound = False
                                                        for lateItem in build['Late']:
                                                            if gameItem == lateItem['Item'] and m == lateItem['Nth']:
                                                                lateItem['Wins'] += win
                                                                lateItem['Matches'] += 1
                                                                lateFound = True
                                                                break                                                        
                                                        if not lateFound:
                                                            build['Late'].append({'Item': gameItem, 'Nth': m, 'Wins': win, 'Matches': 1})
                                                        m += 1
                                                    hero_build[10] = currentCore
                                                    buildFound = True
                                                    break
                                            if not buildFound:
                                                lateGameItems = []
                                                m = 3 if isSupport else 4
                                                noCoreItems = itemBuild[(m-1):]
                                                for _ in range(7):
                                                    if noCoreItems:
                                                        gameItem = noCoreItems.pop(0)
                                                        lateGameItems.append({'Item': gameItem, 'Nth': m, 'Wins': win, 'Matches': 1})
                                                    m += 1
                                                hero_build[10].append({'Core': core, 'Wins': win, 'Matches': 1, 'Late': lateGameItems})

                                            neutralFound = False
                                            for neutralItem in neutralItems:
                                                neutralFound = False
                                                currentNeutrals = copy.deepcopy(hero_build[11])
                                                for currNeutrals in currentNeutrals:
                                                    if currNeutrals['Item'] == neutralItem:
                                                        currNeutrals['Wins'] += win
                                                        currNeutrals['Matches'] += 1
                                                        neutralFound = True
                                                        hero_build[11] = currentNeutrals
                                                        break
                                                if not neutralFound:
                                                    tier = None
                                                    for item_info in item_list:
                                                        if item_info['id'] == neutralItem:
                                                            tier = item_info['neutral_item_tier'] + 1
                                                            break
                                                    hero_build[11].append({'Tier': tier, 'Item': neutralItem, 'Wins': win, 'Matches': 1})

                                        else:

                                            finalTalents = []
                                            for finalTalent in talents:
                                                finalTalents.append({'Talent': finalTalent, 'Wins': win, 'Matches': 1})
                                            finalEarlyItems = []
                                            for tempEarlyItem in earlyItems:
                                                finalEarlyItems.append({'Item': tempEarlyItem['Item'], 'isSecondPurchase': tempEarlyItem['isSecondPurchase'], 'Wins': win, 'Matches': 1})
                                            finalCoreItems = []
                                            lateGameItems = []
                                            m = 3 if isSupport else 4
                                            finalNoCore = itemBuild[(m-1):]
                                            for _ in range(7):
                                                if finalNoCore:
                                                    gameItem = finalNoCore.pop(0)
                                                    lateGameItems.append({'Item': gameItem, 'Nth': m, 'Wins': win, 'Matches': 1})
                                                m += 1
                                            finalCoreItems.append({'Core': core, 'Wins': win, 'Matches': 1, 'Late': lateGameItems})
                                            finalNeutrals = []
                                            if len(neutralItems) > 0:
                                                for finalNeutralItem in neutralItems:
                                                    tier = None
                                                    for item_info in item_list:
                                                        if item_info['id'] == finalNeutralItem:
                                                            tier = item_info['neutral_item_tier'] + 1
                                                            break
                                                    finalNeutrals.append({'Tier': tier, 'Item': finalNeutralItem, 'Wins': win, 'Matches': 1})

                                            tempBuild = [hero_id, rank_value, role, facet, 1, win, 
                                                        [{'Abilities': abilities, 'Wins': win, 'Matches': 1}], finalTalents, 
                                                        [{'Starting': startingItems, 'Wins': win, 'Matches': 1}], finalEarlyItems,
                                                        finalCoreItems, finalNeutrals]
                                            
                                            builds[key] = tempBuild

    return builds

def mergebuilds(existing, new, key_fn):
    index = {key_fn(e): e for e in existing}
    for item in new:
        key = key_fn(item)
        if key in index:
            index[key]["Wins"] += item["Wins"]
            index[key]["Matches"] += item["Matches"]
        else:
            existing.append(item)
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

            updated_abilities = mergebuilds(old_abilities, abilities, lambda a: tuple(a["Abilities"]))
            updated_talents = mergebuilds(old_talents, talents, lambda t: t["Talent"])
            updated_starting = mergebuilds(old_starting, starting, lambda s: tuple(sorted(s["Starting"])))
            updated_early = mergebuilds(old_early, early, lambda e: (e["Item"], e["isSecondPurchase"]))
            updated_neutrals = mergebuilds(old_neutrals, neutrals, lambda n: (n["Tier"], n["Item"]))

            # Core is unique because of Late game items
            existing_index = {tuple(c["Core"]): c for c in old_core}
            for nc in core:
                key = tuple(nc["Core"])
                if key in existing_index:
                    ec = existing_index[key]
                    ec["Wins"] += nc["Wins"]
                    ec["Matches"] += nc["Matches"]
                    ec["Late"] = mergebuilds(ec.get("Late", []), nc.get("Late", []), lambda l: (l["Nth"], l["Item"]))
                else:
                    old_core.append(nc)
            updated_core = old_core

            existing_data[role][str(facet)] = [updated_abilities, updated_talents, updated_starting, updated_early, updated_core, updated_neutrals]

        
        # Organize Updated Builds for faster loading

        # Abilities Page
        top_abilities = sorted(updated_abilities, key=lambda ta: ta["Matches"], reverse=True)[:10]
        existing_abilities[role][str(facet)] = {
            "abilities": top_abilities,
            "talents": updated_talents
        }

        # Items Page
        copied_starting = copy.deepcopy(updated_starting)
        copied_early = copy.deepcopy(updated_early)
        copied_core = copy.deepcopy(updated_core)
        copied_neutrals = copy.deepcopy(updated_neutrals)

        top_starting = sorted(copied_starting, key=lambda ts: ts["Matches"], reverse=True)[:5]
        top_early = sorted(copied_early, key=lambda te: te["Matches"], reverse=True)[:10]
        top_core = sorted(copied_core, key=lambda tc: tc["Matches"], reverse=True)[:10]
        top_neutrals = sorted(copied_neutrals, key=lambda tn: tn["Matches"], reverse=True)

        for tc in top_core:
            top_late = []
            for n in range(lateStart,11):
                nth_items = list(filter(lambda nl: nl["Nth"] == n, tc["Late"]))
                top_late.append(sorted(nth_items, key=lambda tl: tl["Matches"], reverse=True)[:10])
            tc["Late"] = top_late

        existing_items[role][str(facet)] = {
            "starting": top_starting,
            "early": top_early,
            "core": top_core,
            "neutrals": top_neutrals
        }

        # Builds Page
        core_copy = copy.deepcopy(top_core)
        builds_core = core_copy[:3] if len(core_copy) > 0 else None
        if builds_core:
            for bc in builds_core:
                builds_late = []
                for nth_items in bc["Late"]:
                    builds_late.append(nth_items[:3])
                bc["Late"] = builds_late

        existing_builds[role][str(facet)] = {
            "abilities": top_abilities[0] if len(top_abilities) > 0 else None,
            "talents": updated_talents,
            "items": {
                "starting": top_starting[0] if len(top_starting) > 0 else None,
                "early": top_early[:6] if len(top_early) > 0 else None,
                "core": builds_core,
                "neutrals": top_neutrals
            }
        }

    # Dumping Updated Summary
    json.dumps(s3_summary, indent=2)
    s3.put_object(Bucket='dotam-builds', Key=s3_summary_key, Body=json.dumps(s3_summary, indent=2))

    # Dumping Updated Build Data
    json.dumps(existing_data, indent=2)
    s3.put_object(Bucket='dotam-builds', Key=s3_data_key, Body=json.dumps(existing_data, indent=2))

    # Dumping Updated Abilities Page
    json.dumps(existing_abilities, indent=2)
    s3.put_object(Bucket='dotam-builds', Key=s3_abilities_key, Body=json.dumps(existing_abilities, indent=2))

    # Dumping Updated Items Page
    json.dumps(existing_items, indent=2)
    s3.put_object(Bucket='dotam-builds', Key=s3_items_key, Body=json.dumps(existing_items, indent=2))

    # Dumping Updated Builds Page
    json.dumps(existing_builds, indent=2)
    s3.put_object(Bucket='dotam-builds', Key=s3_builds_key, Body=json.dumps(existing_builds, indent=2))

    print("Done: ", hero_id, rank)

def sendtos3(builds):

    grouped_builds = defaultdict(list)

    for (hero_id, rank, role, facet), build in builds.items():
        grouped_builds[(hero_id, rank)].append(build)

    print("Amount of builds: ", len(grouped_builds))

    with ThreadPoolExecutor(max_workers=50) as executor:
        for (hero_id, rank), build_group in grouped_builds.items():
            executor.submit(lambda group=build_group, h=hero_id, r=rank: process_build(group, h, r))

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



# file_path = '/home/ec2-user/dotam/python/daily/seq_num.json'
file_path = './python/daily/seq_num.json'

with open(file_path, 'r') as file:
    data = json.load(file)
    seq_num = data['seq_num']

# facet_path = '/home/ec2-user/dotam/python/daily/facet_nums.json'
facet_path = './python/daily/facet_nums.json'

with open(facet_path, 'r') as file:
    facet_nums = json.load(file)

ranked_matches = []

hourlyDump = 0
builds = {}
build_index = {}

sent_already = False

while True:
    try:

        DOTA_2_URL = SEQ_URL + str(seq_num)
        
        print("Getting dota api games")
        response = requests.get(DOTA_2_URL, timeout=600)

        if response.status_code == 200:
            print("Good response")
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
        elif response.status_code == 429:
            print("Too many requests, waiting 15 seconds")
            time.sleep(15)
        else:
            print("An error occured: ", response.status_code)

        if hourlyDump >= 210:
            end_time = time.time()
            elapsed_time = end_time - start_time
            time_message = f"Sucessfully parsed data! Now sending to S3. That took {round((elapsed_time/60), 2)} minutes"
            print(time_message)
            send_telegram_message(BOT_TOKEN, CHAT_ID, time_message)

            sent_already = True
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