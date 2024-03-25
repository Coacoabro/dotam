#!/usr/bin/env python3

import psycopg2
import json
import requests

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
headers = {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdWJqZWN0IjoiZWNmMWMxNTktMzk5Yy00N2UzLWEyMTktNzZkNjA5MDNmMGE5IiwiU3RlYW1JZCI6Ijk2MTcwMTk2IiwibmJmIjoxNzAyNDM3NzczLCJleHAiOjE3MzM5NzM3NzMsImlhdCI6MTcwMjQzNzc3MywiaXNzIjoiaHR0cHM6Ly9hcGkuc3RyYXR6LmNvbSJ9.JKQ92J9j9QTh5HPtD8sxCSGkbOViKKuCtuBCD2QN0Yk'}

conn = psycopg2.connect(dbname="postgres", user="postgres", password="hotcoacoa", host="hero-stats.cd8guscwwyir.us-east-1.rds.amazonaws.com", port="5432")
cur = conn.cursor() # Open a cursor to perform database operations

currentRole = ''
currentRank = ''

wrArray = []
prArray = []

Roles = ['', 'POSITION_1', 'POSITION_2', 'POSITION_3', 'POSITION_4', 'POSITION_5']
Ranks = ['', 'HERALD', 'GUARDIAN', 'CRUSADER', 'ARCHON', 'LEGEND', 'ANCIENT', 'DIVINE', 'IMMORTAL']

for currentRole in Roles:
    for currentRank in Ranks:
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

        total_matches = 0

        highest_month = max([item['month'] for item in data['data']['heroStats']['winMonth']])

        for item in data['data']['heroStats']['winMonth']:
            if item['month'] == highest_month:
                total_matches += item['matchCount']

        if currentRole != '': 
            finalTotal = total_matches * 5
        else:
            finalTotal = total_matches

        for item in data['data']['heroStats']['winMonth']:
            if item['month'] == highest_month:
                wrArray.append((item['winCount'] / item['matchCount']) if item['matchCount'] else 0)
                prArray.append((item['matchCount'] / finalTotal) if finalTotal else 0)

        for item in data['data']['heroStats']['winMonth']:
            if item['month'] == highest_month:

                hero_id = item['heroId']
                patch = '7.34c'
                matches = item['matchCount']
                wincount = item['winCount']
                winrate = wincount / matches
                pickrate = matches / finalTotal

                sdWR = standardDeviation(wrArray)
                sdPR = standardDeviation(prArray)
                zScoreWR = (winrate - (sum(wrArray) / len(wrArray)) ) / sdWR
                zScorePR = (pickrate - (sum(prArray) / len(prArray)) ) / sdPR

                if zScoreWR < 0:
                    tier_num = zScoreWR - zScorePR
                else:
                    tier_num = zScoreWR + zScorePR

                if pickrate >= 0.0005:
                    tier_str = tierCalc(tier_num)
                else:
                    tier_str = '?'

                cur.execute("""
                INSERT INTO rates (hero_id, patch, matches, wincount, winrate, pickrate, role, rank, tier_num, tier_str) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (hero_id, patch, matches, wincount, winrate, pickrate, currentRole, currentRank, tier_num, tier_str))

        conn.commit() # Commit the transaction











# cur.execute("SELECT * FROM datatest;")
# print(cur.fetchall())

conn.close() # Close communication with the database
