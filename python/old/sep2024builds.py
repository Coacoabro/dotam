#!/usr/bin/env python3

import time
import math
import psycopg2
import json
import requests
import os
import sys
import psutil

from dotenv import load_dotenv

load_dotenv()

# Steam's Web API
API_KEY_1 = os.environ.get('DOTA_API_KEY')
API_KEY = API_KEY_1
SEQ_URL = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistoryBySequenceNum/v1/?key=' + API_KEY + '&start_at_match_seq_num='    

# My Amazon Database
database_url = os.environ.get('DATABASE_URL')
conn = psycopg2.connect(database_url)
cur = conn.cursor() # Open a cursor to perform database operations

res = requests.get("https://dhpoqm1ofsbx7.cloudfront.net/patch.txt")
# patch = res.text
patch = '7.37d'

def actualRank(rank):
    if rank >= 80:
        return ["IMMORTAL", "HIGH"]
    elif rank >= 70:
        return ["DIVINE", "HIGH"]
    elif rank >= 60:
        return ["ANCIENT", "MID"]
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

    # Stratz API
    graphql_token = os.environ.get('NEXT_PUBLIC_REACT_APP_TOKEN')
    stratz_url = 'https://api.stratz.com/graphql' #GraphQL Endpoint
    stratz_headers = {'Authorization': f'Bearer {graphql_token}'}

    Boots = [48, 50, 63, 180, 214, 220, 231, 931] #Brown Boots ID is 29
    Support = [30, 40, 42, 43, 45, 188, 257, 286]
    Consumable = [38, 39, 44, 216, 241, 265, 4204, 4205, 4026]

    Early = [29, 34, 36, 41, 73, 75, 77, 88, 178, 181, 240, 244, 569]
    SupportFull = [37, 79, 90, 92, 102, 226, 231, 254, 269, 1128]
    FullItems = [1, 48, 50, 63, 65, 81, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114,
                116, 119, 121, 123, 125, 127, 131, 133, 135, 137, 139, 141, 143, 145, 
                147, 149, 151, 152, 154, 156, 158, 160, 162, 164, 166, 168, 170, 172, 
                174, 176, 180, 185, 190, 193, 194, 196, 201, 202, 203, 204, 206, 208, 
                210, 214, 220, 223, 225, 226, 229, 231, 232, 235, 236, 242, 247, 249, 
                250, 252, 254, 256, 259, 263, 267, 269, 271, 273, 277, 534, 596, 598, 
                600, 603, 604, 609, 610, 635, 931, 939, 1097, 1107, 1466, 1806, 1808] 
    
    
    Swords = [162, 170, 259]

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

    response = requests.post(stratz_url, json={'query': query}, headers=stratz_headers, timeout=600)
    data = json.loads(response.text)

    for ranked_match in ranked_matches:
        match_id = ranked_match['match_id']
        gqlmatch = data['data']['match_' + str(match_id)]
        if gqlmatch:
            rank = actualRank(gqlmatch['actualRank'])
            players = gqlmatch['players']
            for n, player in enumerate(players):
                purchasedItems = player['stats']['itemPurchases']
                if purchasedItems:
                    hero_id = ranked_match['players'][n]['id']
                    role = player['position']
                    facet = ranked_match['players'][n]['facet']
                    win = ranked_match['players'][n]['won']
                    abilityEvents = player['abilities']
                    abilities = []
                    talents = []

                    for ability in abilityEvents:
                        if ability['abilityId'] != 730 and len(talents) < 4:
                            if ability['isTalent']:
                                talents.append(ability['abilityId'])
                                if len(abilities) < 16:
                                    abilities.append(-1)
                            elif len(abilities) < 16:
                                abilities.append(ability['abilityId'])

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
                    for earlitem in purchasedItems:
                        item_id = earlitem['itemId']
                        if earlitem['time'] < 900 and item_id in Early:
                            secondPurchase = False
                            if item_id in tempItemArray:
                                secondPurchase = True
                            tempItemArray.append(item_id)
                            earlyItems.append({'Item': item_id, 'isSecondPurchase': secondPurchase})

                    # Generating Core Items and Full Items Purchased Order
                    itemBuild = []
                    for item in purchasedItems:
                        if item['itemId'] not in itemBuild:
                            isSecondSword = False
                            if item['itemId'] in Swords:
                                if itemBuild[-1] in Swords:
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
                        break
                    
                    for hero_build in builds:
                        if hero_build[0] == hero_id and hero_build[1] == patch and (hero_build[2] == rank[0] or hero_build[2] == rank[1] or hero_build[2] == "") and hero_build[3] == role and hero_build[4] == facet:
                            
                            hero_build[5] += 1 # Matches increased
                            hero_build[6] += win

                            abilitiesFound = False
                            for abilityBuild in hero_build[7]:
                                if abilityBuild['Abilities'] == abilities:
                                    abilityBuild['Wins'] += win
                                    abilityBuild['Matches'] += 1
                                    abilitiesFound = True
                                    break
                            if not abilitiesFound:
                                hero_build[7].append({'Abilities': abilities, 'Wins': win, 'Matches': 1})
                            
                            for talent in talents:
                                talentFound = False
                                for talentBuild in hero_build[8]:
                                    if talentBuild['Talent'] == talent:
                                        talentBuild['Wins'] += win
                                        talentBuild['Matches'] += 1
                                        talentFound = True
                                        break
                                if not talentFound:
                                    hero_build[8].append({'Talent': talent, 'Wins': win, 'Matches': 1})

                            startingFound = False
                            for startingBuild in hero_build[9]:
                                if sorted(startingBuild['Starting']) == sorted(startingItems):
                                    startingBuild['Wins'] += win
                                    startingBuild['Matches'] += 1
                                    startingFound = True
                                    break
                            if not startingFound:
                                hero_build[9].append({'Starting': startingItems, 'Wins': win, 'Matches': 1})

                            for earlyGameItem in earlyItems:
                                earlyFound = False
                                for earlyItem in hero_build[10]:
                                    if earlyItem['Item'] == earlyGameItem['Item'] and earlyItem['isSecondPurchase'] == earlyGameItem['isSecondPurchase']:
                                        earlyItem['Matches'] += 1
                                        earlyItem['Wins'] += win
                                        earlyFound = True
                                        break
                                if not earlyFound:
                                    hero_build[10].append({'Item': earlyGameItem['Item'], 'isSecondPurchase': earlyGameItem['isSecondPurchase'], 'Wins': win, 'Matches': 1})

                            buildFound = False
                            for build in hero_build[11]:
                                if build['Core'] == core:
                                    build['Wins'] += win
                                    build['Matches'] += 1
                                    m = 3 if isSupport else 4
                                    if m < (m+7):
                                        for index, gameItem in enumerate(itemBuild[m:], start=m):
                                            if index < 7:
                                                lateFound = False
                                                for lateItem in build['Late'][str(m)]:
                                                    if gameItem == lateItem['Item']:
                                                        lateItem['Wins'] += win
                                                        lateItem['Matches'] += 1
                                                        lateFound = True
                                                        break
                                                if not lateFound:
                                                    build['Late'][str(m)].append({'Item': gameItem, 'Wins': win, 'Matches': 1})
                                                m += 1
                                    buildFound = True
                                    break
                            if not buildFound:
                                lateGameItems = {}
                                m = 3 if isSupport else 4
                                for _ in range(7):
                                    if itemBuild:
                                        gameItem = itemBuild.pop(0)
                                        lateGameItems[str(m)] = [{'Item': gameItem, 'Wins': win, 'Matches': 1}]
                                    else:
                                        lateGameItems[str(m)] = []
                                    m += 1
                                hero_build[11].append({'Core': core, 'Wins': win, 'Matches': 1, 'Late': lateGameItems})

    return builds

file_path = './python/daily/seq_num.json'

with open(file_path, 'r') as file:
    data = json.load(file)
    seq_num = data['seq_num']

ranked_matches = []
cur.execute("SELECT * from builds WHERE patch = %s", (patch,))
builds = cur.fetchall()

process = psutil.Process()
mem_info = process.memory_info()
print(f"Resident Set Size: {mem_info.rss / 1024 ** 2:.2f} MB")
print(f"Virtual Memory Size: {mem_info.vms / 1024 ** 2:.2f} MB")

x = 0
for x in range(len(builds)):
    builds[x] = list(builds[x])

dump = False
hourlyDump = 0
hourCounter = 0
hour = 3600 # seconds
start_time = time.time()

while True:

    try:

        DOTA_2_URL = SEQ_URL + str(seq_num)

        response = requests.get(DOTA_2_URL, timeout=600)

        if response.status_code == 200:
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
                    if len(ranked_matches) == 25:
                        hourlyDump += 1
                        print(hourlyDump)
                        builds = getBuilds(ranked_matches, builds)
                        ranked_matches = []
        else:
            seq_num += 1

        if hourlyDump >= 800:
            dump = True
            # remaining = hour - (time.time() - start_time)
            # if remaining > 0:
            #     print("Waiting for another " + str(remaining) + " seconds")
            #     time.sleep(remaining)
            #     hourCounter += 1
            #     hourlyDump = 0
            #     start_time = time.time()
            # else:
            #     hourCounter += 1
            #     hourlyDump = 0
            #     start_time = time.time()
        
        # if hourCounter >= 6:
        #     dump = True

        if dump:
            print("Dumping stuff. Last sequence num is ", seq_num)
            for build in builds:
                cur.execute("""
                    UPDATE builds
                    SET total_matches = %s,
                        total_wins = %s,
                        abilities = %s,
                        talents = %s,
                        starting = %s,
                        early = %s,
                        core = %s,
                        item01 = %s,
                        item02 = %s,
                        item03 = %s,
                        item04 = %s,
                        item05 = %s,
                        item06 = %s,
                        item07 = %s,
                        item08 = %s,
                        item09 = %s,
                        item10 = %s,
                        boots = %s
                    WHERE hero_id = %s AND patch = %s AND rank = %s AND role = %s  AND facet = %s      
                    """, (build[5], build[6], json.dumps(build[7]), json.dumps(build[8]), json.dumps(build[9]), json.dumps(build[10]), json.dumps(build[11]), json.dumps(build[12]), json.dumps(build[13]), json.dumps(build[14]), json.dumps(build[15]), json.dumps(build[16]), json.dumps(build[17]), json.dumps(build[18]), json.dumps(build[19]), json.dumps(build[20]), json.dumps(build[21]), json.dumps(build[22]), build[0], build[1], build[2], build[3], build[4])
                    )
                conn.commit() 
            print("Done. Last sequence num: ", seq_num)
            with open(file_path, 'w') as file:
                json.dump({"seq_num": seq_num}, file)
            dump = False
            conn.close()
            break
    
    except Exception as e:
        print("Error is: ", e)
        print("Dumping stuff. Last sequence num is ", seq_num)
        print("It stopped after the Hour Counter was at ", hourCounter)
        for build in builds:
            cur.execute("""
                UPDATE builds
                SET total_matches = %s,
                    total_wins = %s,
                    abilities = %s,
                    talents = %s,
                    starting = %s,
                    early = %s,
                    core = %s,
                    item01 = %s,
                    item02 = %s,
                    item03 = %s,
                    item04 = %s,
                    item05 = %s,
                    item06 = %s,
                    item07 = %s,
                    item08 = %s,
                    item09 = %s,
                    item10 = %s,
                    boots = %s
                WHERE hero_id = %s AND patch = %s AND rank = %s AND role = %s  AND facet = %s      
                """, (build[5], build[6], json.dumps(build[7]), json.dumps(build[8]), json.dumps(build[9]), json.dumps(build[10]), json.dumps(build[11]), json.dumps(build[12]), json.dumps(build[13]), json.dumps(build[14]), json.dumps(build[15]), json.dumps(build[16]), json.dumps(build[17]), json.dumps(build[18]), json.dumps(build[19]), json.dumps(build[20]), json.dumps(build[21]), json.dumps(build[22]), build[0], build[1], build[2], build[3], build[4])
                )
            conn.commit() 
        print("Done. Last sequence num: ", seq_num)
        with open(file_path, 'w') as file:
            json.dump({"seq_num": seq_num}, file)
        dump = False
        conn.close()
        break
        
