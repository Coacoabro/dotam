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
import clickhouse_connect

from datetime import date, datetime, timezone
from dotenv import load_dotenv
from collections import Counter
from collections import defaultdict
from botocore.exceptions import ClientError
from botocore.config import Config
from concurrent.futures import ThreadPoolExecutor, as_completed, TimeoutError
from multiprocessing import Process, Queue
from clickhouse_connect.driver.exceptions import DataError

load_dotenv()


start_time = time.time()
utc_time = datetime.fromtimestamp(start_time, tz=timezone.utc)
hour = utc_time.hour

# Steam's Web API
API_KEY = os.environ.get('DOTA_API_KEY_A')
SEQ_URL = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistoryBySequenceNum/v1/?key=' + API_KEY + '&start_at_match_seq_num='    

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

# ClickHouse Client Info

client = clickhouse_connect.get_client(
    host=os.getenv('CLICKHOUSE_HOST'),
    user='default',
    password=os.getenv('CLICKHOUSE_KEY'),
    secure=True
)

# result = client.query('SELECT hero_id FROM heroes')
# rows = result.result_rows
# hero_ids = [row[0] for row in rows]

hero_ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 119, 120, 121, 123, 126, 128, 129, 131, 135, 136, 137, 138, 145]


# Telegram Stuff
def send_telegram_message(message):

    bot_token = os.getenv('BOT_TOKEN')
    chat_id = os.getenv('CHAT_ID')

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
    FakeNeutrals = [1440, 1441] # So far the only one I see is Witch Doctors GrisGris

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
            if tries == 2:
                send_telegram_message(f"STRATZ ERROR: {response.text}")
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
                                        if ability['isTalent'] and ability['abilityId'] not in talents:
                                            talents.append(ability['abilityId'])
                                        if len(abilities) < 16:
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

                                    # for rank_value in [rank[0], rank[1], ""]:
                                    ## Right now taking away specific ranks and only doing ALL HIGH MID and LOW
                                    for rank_value in [rank[1], ""]:
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



def batched_insert(table_name, rows, batches):
    global client
    BATCH_SIZE = 10000

    if table_name not in batches:
        batches[table_name] = []
    batches[table_name].extend(rows)

    if len(batches[table_name]) >= BATCH_SIZE:
        print(table_name)
        client.insert(table_name, batches[table_name])
        batches[table_name].clear()

def sendtoclickhouse(builds):
    global patch
    global client
    
    today = date.today()
    batches = defaultdict(list)

    main_rows = []

    for (hero_id, rank, role, facet), build in builds.items():
        try:

            hero_id, rank, role, facet, matches, wins, abilities, talents, starting, early, core, neutrals = build
            main = (today, patch, hero_id, rank, role, facet, wins, matches)
            main_rows.append(main)

            ability_rows = []
            for ability_order, result in abilities.items():
                row = (today, patch, hero_id, rank, role, facet, list(ability_order), result['Wins'], result['Matches'])
                ability_rows.append(row)
            batched_insert('abilities', ability_rows, batches)

            talent_rows = []
            for talent, result in talents.items():
                row = (today, patch, hero_id, rank, role, facet, talent, result['Wins'], result['Matches'])
                talent_rows.append(row)
            batched_insert('talents', talent_rows, batches)

            starting_rows = []
            for starting_order, result in starting.items():
                row = (today, patch, hero_id, rank, role, facet, list(starting_order), result['Wins'], result['Matches'])
                starting_rows.append(row)
            batched_insert('starting', starting_rows, batches)

            early_rows = []
            for (item_id, is_second), result in early.items():
                row = (today, patch, hero_id, rank, role, facet, item_id, is_second, result['Wins'], result['Matches'])
                early_rows.append(row)
            batched_insert('early', early_rows, batches)

            core_rows = []
            late_rows = []
            for core_items, result in core.items():
                late_dict = result['Late']
                core_row = (today, patch, hero_id, rank, role, facet, list(core_items), result['Wins'], result['Matches'])
                core_rows.append(core_row)
                for (late_item, nth), late_result in late_dict.items():
                    late_row = (today, patch, hero_id, rank, role, facet, list(core_items), nth, late_item, late_result['Wins'], late_result['Matches'])
                    late_rows.append(late_row)
                
            batched_insert('core', core_rows, batches)
            batched_insert('late', late_rows, batches)

            neutral_rows = []
            for neutral_item, result in neutrals.items():
                row = (today, patch, hero_id, rank, role, facet, result['Tier'], neutral_item, result['Wins'], result['Matches'])
                neutral_rows.append(row)
            batched_insert('neutrals', neutral_rows, batches)
        
        except DataError as e:
            message = f"ClickHouse error inserting into {hero_id, rank, role, facet}:\n\n{str(e)}"
            # send_telegram_message(message)

    for table_name, rows in batches.items():
        try:
            if rows:
                client.insert(table_name, rows)
        except Exception as e:
            message = f"ClickHouse error inserting into {table_name}:\n\n{str(e)}"
            # send_telegram_message(message)
    
    try:
        client.insert('main', main_rows)
    except Exception as e:
        message = f"ClickHouse error inserting into Main:\n\n{str(e)}"
        # send_telegram_message(message)
    
    

    # Finished!
    print("Done. Last sequence num: ", seq_num)
    with open(file_path, 'w') as file:
        json.dump({"seq_num": seq_num}, file)

    end_time = time.time()
    elapsed_time = end_time - start_time

    time_message = f"Finished sending to ClickHouse. That took {round((elapsed_time/60), 2)} minutes"
    print(time_message)
    # send_telegram_message(time_message)



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

        if hourlyDump >= 1000:
            end_time = time.time()
            elapsed_time = end_time - start_time
            time_message = f"Sucessfully parsed data! Now sending to clickhouse!. That took {round((elapsed_time/60), 2)} minutes"
            print(time_message)
            # send_telegram_message(time_message)
            sendtoclickhouse(builds)
            break

    except Exception as e:
        error_message = f"An error occurred in your script:\n\n{str(e)}"
        print(error_message)
        if str(e) == "local variable 'data' referenced before assignment":
            send_telegram_message("Referenced before assignment, aborting mission")
            break
        else:
            send_telegram_message(error_message)
            if builds and not sent_already:
                sent_already = True
                sendtoclickhouse(builds)
        break