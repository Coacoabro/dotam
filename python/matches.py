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

Early = [34, 36, 73, 75, 77, 88, 178, 181, 240, 244, 569, 596]

SupportFull = [37, 79, 90, 92, 102, 226, 231, 254, 269, 1128]
FullItems = [1, 48, 50, 63, 65, 81, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114,
              116, 119, 121, 123, 125, 127, 131, 133, 135, 137, 139, 141, 143, 145, 
              147, 149, 151, 152, 154, 156, 158, 160, 162, 164, 166, 168, 170, 172, 
              174, 176, 180, 185, 190, 193, 194, 196, 201, 202, 203, 204, 206, 208, 
              210, 214, 220, 223, 225, 226, 229, 231, 232, 235, 236, 242, 247, 249, 
              250, 252, 254, 256, 259, 263, 267, 269, 271, 273, 277, 534, 596, 598, 
              600, 603, 604, 609, 610, 635, 931, 939, 1096, 1107, 1466, 1806, 1808]

def matchDetails(match, builds):

    global stratz_url
    global stratz_headers
    global stored_matches
    global immortal_heroes
    global Support
    global Early
    global SupportFull
    global FullItems


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

    response = requests.post(stratz_url, json={'query': query}, headers=stratz_headers, timeout=10)
    data = json.loads(response.text)

    checker = data['data']['match']['players'][0]['playbackData']
    
    if checker == None:
        return builds
    else:
        if match not in stored_matches:

            didRadiantWin = data['data']['match']['didRadiantWin']
            players = data['data']['match']['players']

            for player in players:
                itemBuild = []
                finalBuild = {}
                for hero in immortal_heroes:
                    if hero[0] == player['heroId'] and hero[6] == player['position']:
                        heroId = hero[0]
                        position = hero[6]
                        win = 0
                        if didRadiantWin == player['isRadiant']:
                            win = 1
                        for item in player['playbackData']['purchaseEvents']:
                            if position == 'POSITION_4' or position == 'POSITION_5':
                                if item['itemId'] in SupportFull or item['itemId'] in FullItems:
                                    itemBuild.append(item['itemId'])
                                if len(itemBuild) >= 2:
                                    core = [itemBuild[0], itemBuild[1]]
                                    late = itemBuild[2:]
                            else:
                                if item['itemId'] in FullItems:
                                    itemBuild.append(item['itemId'])
                                if len(itemBuild) >= 3:
                                    core = [itemBuild[0], itemBuild[1], itemBuild[2]]
                                    late = itemBuild[3:]
                        heroFound = False
                        for hero_role in builds:
                            if hero_role[0] == heroId and hero_role[1] == position:
                                heroFound = True
                                buildFound = False
                                for build in hero_role[3]:
                                    if build['Core'] == core:
                                        build['Wins'] += win
                                        build['Matches'] += 1
                                        buildFound = True
                                        break
                                if not buildFound:
                                    hero_role[3].append({'Core': core, 'Wins': win, 'Matches': 1})
                                break
                        if not heroFound:
                            builds.append([heroId, position, 'Early', [{'Core': core, 'Wins': win, 'Matches': 1}]])
            
                                

                stored_matches.append(match)

        return builds


# match_id_start = 7709069413

while True:
    i = 0
    cur.execute("SELECT * from builds")
    builds = cur.fetchall()
    while i < 36:
        response1 = requests.get(PUBLIC_MATCHES_URL)
        if response1.status_code == 200:
            match_id_start = response1.json()[0]['match_id']
        url = f'{PUBLIC_MATCHES_URL}?less_than_match_id={match_id_start}&min_rank=81'
        response = requests.get(url)
        if response.status_code == 200:
            matches = response.json()
            for match in matches:
                builds = matchDetails(match['match_id'], builds)
                print('New Build:')
                print(builds)
                time.sleep(1)
            match_id_start = matches[-1]['match_id']
        if len(stored_matches) > 86400:
            stored_matches = stored_matches[:43200]
        i += 1
        
    