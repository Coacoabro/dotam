#!/usr/bin/env python3

import psycopg2
import json
import requests
import os

from dotenv import load_dotenv

load_dotenv()

current_patch = '7.37d'

database_url = os.environ.get('DATABASE_URL')
graphql_token = os.environ.get('NEXT_PUBLIC_REACT_APP_TOKEN')

def getQuery(rank):

    global Roles

    roles_query = "\n".join([f"""
    {role}: heroStats {{
        winDay(
        gameModeIds: ALL_PICK_RANKED
        take: 1
        {'positionIds: ' + role if role else ''}
        {'bracketIds: ' + rank if rank else ''}
        ) {{
            day
            winCount
            matchCount
            heroId
        }}
    }}
    """ for role in Roles])

    query = f"""
        query MyQuery {{
            {roles_query}
        }}
    """

    return query

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

cur.execute("SELECT hero_id from heroes;")
hero_ids = [row[0] for row in cur.fetchall()]

# This is how you delete all items from a specific thing you want: cur.execute("DELETE FROM rates WHERE patch = %s", ('7.37b',))

cur.execute("SELECT * FROM rates WHERE patch = %s", (current_patch,))
rates = cur.fetchall()

Roles = ['POSITION_1', 'POSITION_2', 'POSITION_3', 'POSITION_4', 'POSITION_5']
Ranks = ['', 'HERALD', 'GUARDIAN', 'CRUSADER', 'ARCHON', 'LEGEND', 'ANCIENT', 'DIVINE', 'IMMORTAL']

for currentRank in Ranks:

    if rates:
        total_matches = sum(item[2] for item in rates if item[7] == currentRank)
    else:
        total_matches = 0

    wrArray = []
    prArray = []

    query = getQuery(currentRank)

    response = requests.post(url, json={'query': query}, headers=headers)
    data = json.loads(response.text)

    for currentRole in Roles:
        role_data = data['data'][currentRole]
        for item in role_data['winDay']:
            total_matches += item['matchCount']
    
    total_matches /= 10

    for currentRole in Roles:
        role_data = data['data'][currentRole]
        for hero_id in hero_ids:
            matches = 0
            wins = 0
            for item in role_data['winDay']:
                if item['heroId'] == hero_id:
                    matches += item['matchCount']
                    wins += item['winCount']
            if rates:
                for rate in rates:
                    if rate[6] == currentRole and rate[7] == currentRank and rate[0] == hero_id:
                        matches += rate[2]
                        wins += rate[3]
            PR = matches / total_matches
            WR =  wins / matches
            if(PR > 0.005):
                wrArray.append(WR)
                prArray.append(PR)

    for currentRole in Roles:
        role_data = data['data'][currentRole]
        for hero_id in hero_ids:
            matches = 0
            wincount = 0
            for item in role_data['winDay']:
                if item['heroId'] == hero_id:
                    matches += item['matchCount']
                    wincount += item['winCount']
            if rates:
                for rate in rates:
                    if rate[6] == currentRole and rate[7] == currentRank and rate[0] == hero_id:
                        matches += rate[2]
                        wincount += rate[3]
                    
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

            if rates:
                cur.execute("""
                    INSERT INTO rates (hero_id, patch, matches, wincount, winrate, pickrate, role, rank, tier_num, tier_str) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (hero_id, patch, rank, role)
                    DO UPDATE SET 
                        matches = EXCLUDED.matches,
                        wincount = EXCLUDED.wincount,
                        winrate = EXCLUDED.winrate,
                        pickrate = EXCLUDED.pickrate,
                        tier_num = EXCLUDED.tier_num,
                        tier_str = EXCLUDED.tier_str
                """, (hero_id, current_patch, matches, wincount, winrate, pickrate, currentRole, currentRank, tier_num, tier_str))
            else:
                cur.execute("""
                    INSERT INTO rates (hero_id, patch, matches, wincount, winrate, pickrate, role, rank, tier_num, tier_str) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (hero_id, current_patch, matches, wincount, winrate, pickrate, currentRole, currentRank, tier_num, tier_str))

            
        conn.commit() # Commit the transaction

conn.close() # Close communication with the database
