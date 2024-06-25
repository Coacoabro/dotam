#!/usr/bin/env python3

import time
import psycopg2
import json
import requests
import os

from dotenv import load_dotenv

load_dotenv()

# Steam's Web API
API_KEY = os.environ.get('DOTA_API_KEY')
SEQ_URL = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistoryBySequenceNum/v1/?key=' + API_KEY + '&start_at_match_seq_num='    

# My Amazon Database
database_url = os.environ.get('DATABASE_URL')
conn = psycopg2.connect(database_url)
cur = conn.cursor() # Open a cursor to perform database operations

def actualRank(rank):
    if rank >= 80:
        return "IMMORTAL"
    elif rank >= 70:
        return "DIVINE"
    elif rank >= 60:
        return "ANCIENT"
    elif rank >= 50:
        return "LEGEND"
    elif rank >= 40:
        return "ARCHON"
    elif rank >= 30:
        return "CRUSADER"
    elif rank >= 20:
        return "GUARDIAN"
    else:
        return "HERALD"                

def getBuilds(ranked_matches, builds):

    patch = '7.36b'

    # Stratz API
    graphql_token = os.environ.get('NEXT_PUBLIC_REACT_APP_TOKEN')
    stratz_url = 'https://api.stratz.com/graphql' #GraphQL Endpoint
    stratz_headers = {'Authorization': f'Bearer {graphql_token}'}

    Boots = [29, 48, 50, 63, 180, 214, 220, 231, 931] #Brown Boots ID is 29
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
                                abilities.append(-1)
                            else:
                                abilities.append(ability['abilityId'])
                    isSupport = False
                    if role == 'POSITION_4' or role == 'POSITION_5':
                        isSupport = True

                    

                    # Starting and Early Game Items
                    startingItems = []
                    earlyItems = []
                    tempItemArray = []
                    for item in purchasedItems:
                        item_id = item['itemId']
                        if item['time'] < 0:
                            startingItems.append(item_id)
                        elif item['time'] < 900 and item_id in Early:
                            secondPurchase = False
                            if item_id in tempItemArray:
                                secondPurchase = True
                            tempItemArray.append(item_id)
                            earlyItems.append({'Item': item['itemId'], 'isSecondPurchase': secondPurchase})
                        else:
                            break
                    

                    # Generating Core Items and Full Items Purchased Order
                    itemBuild = []
                    for item in purchasedItems:
                        if item['itemId'] not in itemBuild:
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
                    
                    heroFound = False
                    for hero_build in builds:
                        if hero_build[0] == hero_id and hero_build[1] == patch and hero_build[2] == rank and hero_build[3] == role and hero_build[4] == facet:
                            hero_build[5] += 1 # Matches increased
                            heroFound = True

                            abilitiesFound = False
                            for abilityBuild in hero_build[6]:
                                if abilityBuild['Abilities'] == abilities:
                                    abilityBuild['Wins'] += win
                                    abilityBuild['Matches'] += 1
                                    abilitiesFound = True
                                    break
                            if not abilitiesFound:
                                hero_build[6].append({'Abilities': abilities, 'Wins': win, 'Matches': 1})
                            
                            for n, talent in enumerate(talents):
                                talentFound = False
                                for talentBuild in hero_build[7]:
                                    if talentBuild['Talent'] == talent:
                                        talentBuild['Wins'] += win
                                        talentBuild['Matches'] += 1
                                        talentFound = True
                                        break
                                if not talentFound:
                                    hero_build[7].append({'Level': n+1, 'Talent': talent, 'Wins': win, 'Matches': 1})

                            startingFound = False
                            for startingBuild in hero_build[8]:
                                if sorted(startingBuild['Starting']) == sorted(startingItems):
                                    startingBuild['Wins'] += win
                                    startingBuild['Matches'] += 1
                                    startingFound = True
                                    break
                            if not startingFound:
                                hero_build[8].append({'Starting': startingItems, 'Wins': win, 'Matches': 1})

                            for earlyGameItem in earlyItems:
                                earlyFound = False
                                for earlyItem in hero_build[9]:
                                    if earlyItem['Item'] == earlyGameItem['Item'] and earlyItem['isSecondPurchase'] == earlyGameItem['isSecondPurchase']:
                                        earlyItem['Matches'] += 1
                                        earlyItem['Wins'] += win
                                        earlyFound = True
                                        break
                                if not earlyFound:
                                    hero_build[9].append({'Item': earlyGameItem['Item'], 'Matches': 1, 'Wins': win, 'isSecondPurchase': earlyGameItem['isSecondPurchase']})

                            buildFound = False
                            for build in hero_build[10]:
                                if build['Core'] == core:
                                    build['Wins'] += win
                                    build['Matches'] += 1
                                    buildFound = True
                                    break
                            if not buildFound:
                                hero_build[10].append({'Core': core, 'Wins': win, 'Matches': 1})
                            
                            n = 10
                            for gameItem in itemBuild:
                                n += 1
                                if n < 21:
                                    itemOrderFound = False
                                    for orderedItem in hero_build[n]:
                                        if orderedItem['Item'] == gameItem:
                                            orderedItem['Wins'] += win
                                            orderedItem['Matches'] += 1
                                            itemOrderFound = True
                                            break
                                    if not itemOrderFound:
                                        hero_build[n].append({'Item': gameItem, 'Wins': win, 'Matches': 1})
                            
                            break

                    if not heroFound:
                        # Starting and Early Game Items
                        startingItems = []
                        earlyItems = []
                        tempItemArray = []
                        talentArray = []
                        for item in purchasedItems:
                            item_id = item['itemId']
                            if item['time'] < 0:
                                startingItems.append(item_id)
                            if item['time'] <= 900 and item_id in Early:
                                secondPurchase = False
                                if item_id in tempItemArray:
                                    secondPurchase = True
                                tempItemArray.append(item_id)
                                earlyItems.append({'Item': item['itemId'], 'Matches': 1, 'Wins': win, 'isSecondPurchase': secondPurchase})
                        startingObj = [{'Starting': startingItems, 'Wins': win, 'Matches': 1}]
                        abilitiesObj = [{'Abilities': abilities, 'Wins': win, 'Matches': 1}]
                        for n, talent in enumerate(talents):
                            talentArray.append({'Level': n+1, 'Talent': talent, 'Wins': win, 'Matches': 1})
                        

                        full_data = [hero_id, patch, rank, role, facet, 1, abilitiesObj, talentArray, startingObj, earlyItems, [{'Core': core, 'Wins': win, 'Matches': 1}]]
                        for item in itemBuild:
                            full_data.append([{'Item': item, 'Wins': win, 'Matches': 1}])
                        while len(full_data) < 21:
                            full_data.append([])
                        builds.append(full_data)
    return builds


seq_num = 6576623346
ranked_matches = []
builds = []
hourlyDump = 0 #This should get up to 400, then start the builds organization process
fiveHours = 0
while fiveHours < 3:

    DOTA_2_URL = SEQ_URL + str(seq_num)

    response = requests.get(DOTA_2_URL)

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
                    builds = getBuilds(ranked_matches, builds)
                    ranked_matches = []
    else:
        seq_num += 1

    if hourlyDump > 400:
        print("Dumping Builds")
        for build in builds:
            cur.execute("""
                SELECT 1 FROM builds 
                WHERE hero_id = %s AND patch = %s AND rank = %s AND role = %s  AND facet = %s
                LIMIT 1
            """, (build[0], build[1], build[2], build[3], build[4]))
            if cur.fetchone():
                cur.execute("""
                    UPDATE builds
                    SET total_matches = %s,
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
                        item10 = %s
                    WHERE hero_id = %s AND patch AND rank = %s AND role = %s  AND facet = %s      
                    """, (build[5], json.dumps(build[6]), json.dumps(build[7]), json.dumps(build[8]), json.dumps(build[9]), json.dumps(build[10]), json.dumps(build[11]), json.dumps(build[12]), json.dumps(build[13]), json.dumps(build[14]), json.dumps(build[15]), json.dumps(build[16]), json.dumps(build[17]), json.dumps(build[18]), json.dumps(build[19]), json.dumps(build[20]), build[0], build[1], build[2], build[3]), build[4])
            else:
                cur.execute("""
                        INSERT INTO builds (hero_id, patch, rank, role, facet, total_matches, abilities, talents, starting, early, core, item01, item02, item03, item04, item05, item06, item07, item08, item09, item10) 
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (build[0], build[1], build[2], build[3], build[4], build[5], json.dumps(build[6]), json.dumps(build[7]), json.dumps(build[8]), json.dumps(build[9]), json.dumps(build[10]), json.dumps(build[11]), json.dumps(build[12]), json.dumps(build[13]), json.dumps(build[14]), json.dumps(build[15]), json.dumps(build[16]), json.dumps(build[17]), json.dumps(build[18]), json.dumps(build[19]), json.dumps(build[20]))
                )
        conn.commit() 
        hourlyDump = 0
        builds = []
        fiveHours += 1
