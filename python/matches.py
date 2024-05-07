#!/usr/bin/env python3

import time
import psycopg2
import json
import requests
import os

from dotenv import load_dotenv

load_dotenv()

database_url = os.environ.get('DATABASE_URL')
graphql_token = os.environ.get('NEXT_PUBLIC_REACT_APP_TOKEN')

stratz_url = 'https://api.stratz.com/graphql' #GraphQL Endpoint
stratz_headers = {'Authorization': f'Bearer {graphql_token}'}

conn = psycopg2.connect(database_url)
cur = conn.cursor() # Open a cursor to perform database operations

cur.execute("SELECT * from rates WHERE rank = 'IMMORTAL' and pickrate > 0.0049;")
immortal_heroes = cur.fetchall()



# Steam's Web API
API_KEY = os.environ.get('DOTA_API_KEY')
SEQ_URL = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistoryBySequenceNum/v1/?start_at_match_seq_num='
MATCH_URL = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v1/?key=4392C8D826954FCC8251C025E2010342&match_id=7699115115'

# OpenDota's API
PUBLIC_MATCHES_URL = 'https://api.opendota.com/api/publicMatches'

seq_num_start = 6121215528

stored_matches = []

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

def matchDetails(match, builds):

    global stratz_url
    global stratz_headers
    global stored_matches
    global immortal_heroes
    global Support
    global Early
    global SupportFull
    global FullItems

    Order = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Nineth', 'Tenth']


    query = f"""
            query{{
                match(id: {match}) {{
                    didRadiantWin
                        players {{
                            heroId
                            isRadiant
                            position
                            playbackData {{
                                purchaseEvents {{
                                    itemId
                                    time
                                }}
                            }}
                        }}
                    }}
            }}
        """

    response = requests.post(stratz_url, json={'query': query}, headers=stratz_headers, timeout=60)
    data = json.loads(response.text)

    checker1 = data['data']['match']
    
    if checker1 == None:
        return builds
    else:
        checker2 = data['data']['match']['players'][0]['playbackData']
        if checker2 == None:
            return builds
        else:
            if match not in stored_matches:

                didRadiantWin = data['data']['match']['didRadiantWin']
                players = data['data']['match']['players']

                for player in players:
                    for hero in immortal_heroes:
                        heroId = hero[0]
                        position = hero[6]
                        
                        if heroId == player['heroId'] and position == player['position']:

                            purchasedItems = player['playbackData']['purchaseEvents']

                            isSupport = False
                            if position == 'POSITION_4' or position == 'POSITION_5':
                                isSupport = True

                            win = 0
                            if didRadiantWin == player['isRadiant']:
                                win = 1

                            # Early Game Items
                            earlyItems = []
                            tempItemArray = []
                            for item in purchasedItems:
                                item_id = item['itemId']
                                if item['time'] < 900 and item_id in Early:
                                    secondPurchase = False
                                    if item_id in tempItemArray:
                                        secondPurchase = True
                                    tempItemArray.append(item_id)
                                    earlyItems.append({'Item': item['itemId'], 'isSecondPurchase': secondPurchase})

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
                            for hero_role in builds:
                                if hero_role[0] == heroId and hero_role[1] == position:
                                    hero_role[2] += 1 # Matches increased
                                    heroFound = True

                                    
                                    for earlyGameItem in earlyItems:
                                        earlyFound = False
                                        for earlyItem in hero_role[3]:
                                            if earlyItem['Item'] == earlyGameItem['Item'] and earlyItem['isSecondPurchase'] == earlyGameItem['isSecondPurchase']:
                                                earlyItem['Matches'] += 1
                                                earlyItem['Wins'] += win
                                                earlyFound = True
                                                break
                                        if not earlyFound:
                                            hero_role[3].append({'Item': earlyGameItem['Item'], 'Matches': 1, 'Wins': win, 'isSecondPurchase': earlyGameItem['isSecondPurchase']})

                                    buildFound = False
                                    for build in hero_role[4]:
                                        if build['Core'] == core:
                                            build['Wins'] += win
                                            build['Matches'] += 1
                                            buildFound = True
                                            break
                                    if not buildFound:
                                        hero_role[4].append({'Core': core, 'Wins': win, 'Matches': 1})
                                    
                                    n = 4
                                    for gameItem in itemBuild:
                                        n += 1
                                        if n < 15:
                                            itemOrderFound = False
                                            for orderedItem in hero_role[n]:
                                                if orderedItem['Item'] == gameItem:
                                                    orderedItem['Wins'] += win
                                                    orderedItem['Matches'] += 1
                                                    itemOrderFound = True
                                                    break
                                            if not itemOrderFound:
                                                hero_role[n].append({'Item': gameItem, 'Wins': win, 'Matches': 1})

                                    break
                            if not heroFound:

                                # Early Game Items
                                earlyItems = []
                                tempItemArray = []
                                for item in purchasedItems:
                                    item_id = item['itemId']
                                    if item['time'] <= 900 and item_id in Early:
                                        secondPurchase = False
                                        if item_id in tempItemArray:
                                            secondPurchase = True
                                        tempItemArray.append(item_id)
                                        earlyItems.append({'Item': item['itemId'], 'Matches': 1, 'Wins': win, 'isSecondPurchase': secondPurchase})

                                full_data = [heroId, position, 1, earlyItems, [{'Core': core, 'Wins': win, 'Matches': 1}]]
                                for item in itemBuild:
                                    full_data.append([{'Item': item, 'Wins': win, 'Matches': 1}])
                                while len(full_data) < 15:
                                    full_data.append([])
                                builds.append(full_data)

                    stored_matches.append(match)

            return builds


# match_id_start = 7709069413

# while True:
i = 0
cur.execute("SELECT * from builds")
builds = cur.fetchall()

# with open("test2.json", "w") as json_file:
#     json.dump(builds, json_file, indent=4)    

n = 0
for n in range(len(builds)):
    builds[n] = list(builds[n])

while i < 1: # 18 x 2 seconds x 100 matches = 3600 seconds = 1 hour
    response1 = requests.get(PUBLIC_MATCHES_URL)
    if response1.status_code == 200:
        match_id_start = response1.json()[0]['match_id']
    url = f'{PUBLIC_MATCHES_URL}?less_than_match_id={match_id_start}' # &min_rank=81
    response = requests.get(url)
    if response.status_code == 200:
        matches = response.json()
        for match in matches:
            builds = matchDetails(match['match_id'], builds)
            # time.sleep(2)
        match_id_start = matches[-1]['match_id']
    if len(stored_matches) > 86400:
        stored_matches = stored_matches[:43200]
    i += 1



for build in builds:
    cur.execute("""
        SELECT 1 FROM builds WHERE hero_id = %s AND role = %s
    """, (build[0], build[1]))
    if cur.fetchone():
        cur.execute("""
            UPDATE builds
            SET total_matches = %s,
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
            WHERE hero_id = %s AND role = %s        
            """, (build[2], json.dumps(build[3]), json.dumps(build[4]), json.dumps(build[5]), json.dumps(build[6]), json.dumps(build[7]), json.dumps(build[8]), json.dumps(build[9]), json.dumps(build[10]), json.dumps(build[11]), json.dumps(build[12]), json.dumps(build[13]), json.dumps(build[14]), build[0], build[1]))
    else:
        cur.execute("""
                INSERT INTO builds (hero_id, role, total_matches, early, core, item01, item02, item03, item04, item05, item06, item07, item08, item09, item10) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (build[0], build[1], build[2], json.dumps(build[3]), json.dumps(build[4]), json.dumps(build[5]), json.dumps(build[6]), json.dumps(build[7]), json.dumps(build[8]), json.dumps(build[9]), json.dumps(build[10]), json.dumps(build[11]), json.dumps(build[12]), json.dumps(build[13]), json.dumps(build[14]))
        )
conn.commit()

    
    