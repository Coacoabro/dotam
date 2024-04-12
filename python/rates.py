#!/usr/bin/env python3

import psycopg2
import json
import requests
import os

from dotenv import load_dotenv

load_dotenv()

database_url = os.environ.get('DATABASE_URL')
graphql_token = os.environ.get('NEXT_PUBLIC_REACT_APP_TOKEN')

def standardDeviation(arr):
    n = len(arr)
    mean = sum(arr) / n
    deviations = [(x - mean) ** 2 for x in arr]
    variance = sum(deviations) / n
    return variance ** 0.5

def tierCalc(tier_num):
    if tier_num >= 3:
        return 'S+'
    elif tier_num >= 2:
        return 'S'
    elif tier_num >= 1:
        return 'A'
    elif tier_num >= 0:
        return 'B'
    elif tier_num >= -1:
        return 'C'
    elif tier_num >= -2:
        return 'D'
    else:
        return 'F'

url = 'https://api.stratz.com/graphql' #GraphQL Endpoint
headers = {'Authorization': f'Bearer {graphql_token}'} 

conn = psycopg2.connect(database_url)
cur = conn.cursor() # Open a cursor to perform database operations

Roles = ['POSITION_1', 'POSITION_2', 'POSITION_3', 'POSITION_4', 'POSITION_5']
Ranks = ['', 'HERALD', 'GUARDIAN', 'CRUSADER', 'ARCHON', 'LEGEND', 'ANCIENT', 'DIVINE', 'IMMORTAL']


for currentRank in Ranks:

    total_matches = 0

    wrArray = []
    prArray = []

    for currentRole in Roles:
        query = f"""
            query{{
                heroStats {{
                winMonth(
                    gameModeIds: ALL_PICK_RANKED
                    {'positionIds: ' + currentRole if currentRole else ''}
                    {'bracketIds: ' + currentRank if currentRank else ''}
                ) {{
                    month
                    winCount
                    matchCount
                    heroId
                }}
                }}
            }}
        """

        response = requests.post(url, json={'query': query}, headers=headers)
        data = json.loads(response.text)

        highest_month = max([item['month'] for item in data['data']['heroStats']['winMonth']])

        for item in data['data']['heroStats']['winMonth']:
            if item['month'] == highest_month:
                total_matches += item['matchCount']

    total_matches /= 10

    for currentRole in Roles:
        query = f"""
            query{{
                heroStats {{
                winMonth(
                    gameModeIds: ALL_PICK_RANKED
                    {'positionIds: ' + currentRole if currentRole else ''}
                    {'bracketIds: ' + currentRank if currentRank else ''}
                ) {{
                    month
                    winCount
                    matchCount
                    heroId
                }}
                }}
            }}
        """

        response = requests.post(url, json={'query': query}, headers=headers)
        data = json.loads(response.text)

        

        for item in data['data']['heroStats']['winMonth']:
            if item['month'] == highest_month:
                PR = item['matchCount'] / total_matches
                WR = item['winCount'] / item['matchCount']
                if(PR > 0.005):
                    wrArray.append(WR)
                    prArray.append(PR)

    for currentRole in Roles:
        query = f"""
            query{{
                heroStats {{
                winMonth(
                    gameModeIds: ALL_PICK_RANKED
                    {'positionIds: ' + currentRole if currentRole else ''}
                    {'bracketIds: ' + currentRank if currentRank else ''}
                ) {{
                    month
                    winCount
                    matchCount
                    heroId
                }}
                }}
            }}
        """

        response = requests.post(url, json={'query': query}, headers=headers)
        data = json.loads(response.text)

        for item in data['data']['heroStats']['winMonth']:
            if item['month'] == highest_month:

                hero_id = item['heroId']
                patch = '7.35d'
                matches = item['matchCount']
                wincount = item['winCount']
                winrate = wincount / matches
                pickrate = matches / total_matches

                if pickrate >= 0.005:
                    sdWR = standardDeviation(wrArray)
                    sdPR = standardDeviation(prArray)
                    zScoreWR = (winrate - (sum(wrArray) / len(wrArray)) ) / sdWR
                    zScorePR = (pickrate - (sum(prArray) / len(prArray)) ) / sdPR

                    if zScoreWR < 0:
                        tier_num = zScoreWR - zScorePR
                    else:
                        tier_num = zScoreWR + zScorePR

                    tier_str = tierCalc(tier_num)

                    print(hero_id, round((winrate*100), 2), round((pickrate*100), 2), tier_str)
                else:
                    tier_num = ''
                    tier_str = '?'

                cur.execute("""
                INSERT INTO rates (hero_id, patch, matches, wincount, winrate, pickrate, role, rank, tier_num, tier_str) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (hero_id, patch, matches, wincount, winrate, pickrate, currentRole, currentRank, tier_num, tier_str))
        
        conn.commit() # Commit the transaction



        
    


# cur.execute("SELECT * FROM datatest;")
# print(cur.fetchall())

conn.close() # Close communication with the database
