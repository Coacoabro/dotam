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
    if tier_num >= 2.5:
        return 'S+'
    elif tier_num >= 1.5:
        return 'S'
    elif tier_num >= 0.5:
        return 'A'
    elif tier_num >= -0.5:
        return 'B'
    elif tier_num >= -1.5:
        return 'C'
    elif tier_num >= -2.5:
        return 'D'
    else:
        return 'F'

url = 'https://api.stratz.com/graphql' #GraphQL Endpoint
headers = {'Authorization': f'Bearer {graphql_token}'} 

conn = psycopg2.connect(database_url)
cur = conn.cursor() # Open a cursor to perform database operations

cur.execute("SELECT * from rates WHERE patch = '7.36a';");
rates = cur.fetchall()

Roles = ['POSITION_1', 'POSITION_2', 'POSITION_3', 'POSITION_4', 'POSITION_5']
Ranks = ['', 'HERALD', 'GUARDIAN', 'CRUSADER', 'ARCHON', 'LEGEND', 'ANCIENT', 'DIVINE', 'IMMORTAL']


for currentRank in Ranks:

    total_matches = sum(item[2] for item in rates if item[7] == currentRank)

    wrArray = []
    prArray = []

    for currentRole in Roles:
        query = f"""
            query{{
                heroStats {{
                winDay(
                    gameModeIds: ALL_PICK_RANKED
                    {'positionIds: ' + currentRole if currentRole else ''}
                    {'bracketIds: ' + currentRank if currentRank else ''}
                ) {{
                    day
                    winCount
                    matchCount
                    heroId
                }}
                }}
            }}
        """

        response = requests.post(url, json={'query': query}, headers=headers)
        data = json.loads(response.text)

        highest_day = max([item['day'] for item in data['data']['heroStats']['winDay']])

        for item in data['data']['heroStats']['winDay']:
            if item['day'] == highest_day:
                total_matches += item['matchCount']

    total_matches /= 10

    for currentRole in Roles:
        query = f"""
            query{{
                heroStats {{
                winDay(
                    gameModeIds: ALL_PICK_RANKED
                    {'positionIds: ' + currentRole if currentRole else ''}
                    {'bracketIds: ' + currentRank if currentRank else ''}
                ) {{
                    day
                    winCount
                    matchCount
                    heroId
                }}
                }}
            }}
        """

        response = requests.post(url, json={'query': query}, headers=headers)
        data = json.loads(response.text)

        

        for item in data['data']['heroStats']['winDay']:
            if item['day'] == highest_day:
                for rate in rates:
                    if rate[6] == currentRole and rate[7] == currentRank and rate[0] == item['heroId']:
                        matches = rate[2] + item['matchCount']
                        wins = rate[3] + item['winCount']
                PR = matches / total_matches
                WR =  wins / matches
                if(PR > 0.005):
                    wrArray.append(WR)
                    prArray.append(PR)

    for currentRole in Roles:
        query = f"""
            query{{
                heroStats {{
                winDay(
                    gameModeIds: ALL_PICK_RANKED
                    {'positionIds: ' + currentRole if currentRole else ''}
                    {'bracketIds: ' + currentRank if currentRank else ''}
                ) {{
                    day
                    winCount
                    matchCount
                    heroId
                }}
                }}
            }}
        """

        response = requests.post(url, json={'query': query}, headers=headers)
        data = json.loads(response.text)

        for item in data['data']['heroStats']['winDay']:
            if item['day'] == highest_day:

                hero_id = item['heroId']
                patch = '7.36a'
                for rate in rates:
                    if rate[6] == currentRole and rate[7] == currentRank and rate[0] == hero_id:
                        matches = item['matchCount'] + rate[2]
                        wincount = item['winCount'] + rate[3]
                winrate = wincount / matches
                pickrate = matches / total_matches

                if pickrate >= 0.005:
                    sdWR = standardDeviation(wrArray)
                    sdPR = standardDeviation(prArray)
                    zScoreWR = (winrate - (sum(wrArray) / len(wrArray)) ) / sdWR
                    zScorePR = (pickrate - (sum(prArray) / len(prArray)) ) / sdPR

                    if zScoreWR < 0:
                        tier_num = zScoreWR - abs(zScorePR)
                    else:
                        tier_num = zScoreWR + zScorePR

                    tier_str = tierCalc(tier_num)

                else:
                    tier_num = 0
                    tier_str = '?'

                cur.execute("""
                    INSERT INTO rates (hero_id, patch, matches, wincount, winrate, pickrate, role, rank, tier_num, tier_str) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (hero_id, rank, role)
                    DO UPDATE SET 
                        patch = EXCLUDED.patch,
                        matches = EXCLUDED.matches,
                        wincount = EXCLUDED.wincount,
                        winrate = EXCLUDED.winrate,
                        pickrate = EXCLUDED.pickrate,
                        tier_num = EXCLUDED.tier_num,
                        tier_str = EXCLUDED.tier_str
                """, (hero_id, patch, matches, wincount, winrate, pickrate, currentRole, currentRank, tier_num, tier_str))
        conn.commit() # Commit the transaction



        
    


# cur.execute("SELECT * FROM datatest;")
# print(cur.fetchall())

conn.close() # Close communication with the database
