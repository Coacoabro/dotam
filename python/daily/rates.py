#!/usr/bin/env python3

import psycopg2
import json
import requests
import os
import time
import boto3
import datetime
import clickhouse_connect

start_time = time.time()

from dotenv import load_dotenv
from datetime import datetime
from botocore.exceptions import ClientError
from concurrent.futures import ThreadPoolExecutor
from collections import defaultdict

load_dotenv()

response = requests.get("https://dhpoqm1ofsbx7.cloudfront.net/patch.txt")
current_patch = response.text
database_url = os.environ.get('DATABASE_URL')
graphql_token = os.environ.get('NEXT_PUBLIC_REACT_APP_TOKEN')

url = 'https://api.stratz.com/graphql' #GraphQL Endpoint
headers = {'Authorization': f'Bearer {graphql_token}', 'User-Agent': 'STRATZ_API'}

# client = clickhouse_connect.get_client(
#     host=os.getenv('CLICKHOUSE_HOST'),
#     user='default',
#     password=os.getenv('CLICKHOUSE_KEY'),
#     secure=True
# )

# result = client.query('SELECT hero_id FROM heroes')
# rows = result.result_rows
# hero_ids = [row[0] for row in rows]

hero_ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 119, 120, 121, 123, 126, 128, 129, 131, 135, 136, 137, 138, 145]


s3 = boto3.client('s3')

def getQuery(rank):

    global Roles

    roles_query = "\n".join([f"""
    {role}: heroStats {{
        winHour(
        gameModeIds: ALL_PICK_RANKED
        take: 1
        {'positionIds: ' + role if role else ''}
        {'bracketIds: ' + rank if rank else ''}
        ) {{
            hour
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


try:
    rates_obj = s3.get_object(Bucket='dotam-content', Key=f"data/{current_patch}/rates.json")
    rates = json.loads(rates_obj['Body'].read().decode('utf-8'))
    print("Rates received")
except ClientError as e:
    if e.response['Error']['Code'] == 'NoSuchKey':
        rates = []
        print("No rates")
    else:
        raise

Roles = ['POSITION_1', 'POSITION_2', 'POSITION_3', 'POSITION_4', 'POSITION_5']
Ranks = ['', 'HERALD', 'GUARDIAN', 'CRUSADER', 'ARCHON', 'LEGEND', 'ANCIENT', 'DIVINE', 'IMMORTAL']
CombinedRanks = {
    'LOW': ['HERALD', 'GUARDIAN', 'CRUSADER'], 
    'MID': ['ARCHON', 'LEGEND'], 
    'HIGH': ['ANCIENT', 'DIVINE', 'IMMORTAL']
}
combinedArray = {
    'LOW': {
        'POSITION_1': [],
        'POSITION_2': [],
        'POSITION_3': [],
        'POSITION_4': [],
        'POSITION_5': []
    },
    'MID': {
        'POSITION_1': [],
        'POSITION_2': [],
        'POSITION_3': [],
        'POSITION_4': [],
        'POSITION_5': []
    },
    'HIGH': {
        'POSITION_1': [],
        'POSITION_2': [],
        'POSITION_3': [],
        'POSITION_4': [],
        'POSITION_5': []
    }
}


updated_rates = []


for currentRank in Ranks:

    if rates:
        total_matches = sum(item["matches"] for item in rates if item["rank"] == currentRank)
    else:
        total_matches = 0

    wrArray = []
    prArray = []

    query = getQuery(currentRank)

    response = requests.post(url, json={'query': query}, headers=headers)
    data = json.loads(response.text)

    currentTier = None

    for tier, ranks_list in CombinedRanks.items():
        if currentRank in ranks_list:
            currentTier = tier

    for currentRole in Roles:
        if currentTier != None:
            combinedArray[currentTier][currentRole].extend(data['data'][currentRole]['winHour'])
            if rates:
                for rate in rates:
                    if rate["rank"] == currentRank and rate["role"] == currentRole:
                        tempObj = {
                            'heroId': rate["hero_id"],
                            'matchCount': rate["matches"],
                            'winCount': rate["wincount"]
                        }
                        combinedArray[currentTier][currentRole].append(tempObj)
        role_data = data['data'][currentRole]
        for item in role_data['winHour']:
            total_matches += item['matchCount']
    
    total_matches /= 10

    for currentRole in Roles:
        role_data = data['data'][currentRole]
        for hero_id in hero_ids:
            matches = 0
            wins = 0
            for item in role_data['winHour']:
                if item['heroId'] == hero_id:
                    matches += item['matchCount']
                    wins += item['winCount']
            if rates:
                for rate in rates:
                    if rate["role"] == currentRole and rate["rank"] == currentRank and rate["hero_id"] == hero_id:
                        matches += rate["matches"]
                        wins += rate["wincount"]
            if matches > 0:
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
            for item in role_data['winHour']:
                if item['heroId'] == hero_id:
                    matches += item['matchCount']
                    wincount += item['winCount']
            if rates:
                for rate in rates:
                    if rate["role"] == currentRole and rate["rank"] == currentRank and rate["hero_id"] == hero_id:
                        matches += rate["matches"]
                        wincount += rate["wincount"]

            if matches > 0:        
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

                updated_rates.append({
                    "hero_id": hero_id,
                    "patch": current_patch,
                    "matches": matches,
                    "wincount": wincount,
                    "winrate": winrate,
                    "pickrate": pickrate,
                    "role": currentRole,
                    "rank": currentRank,
                    "tier_num": tier_num,
                    "tier_str": tier_str
                })

                print(hero_id, currentRole, currentRank)


for tier, tier_roles in combinedArray.items():
    total_matches = 0
    if rates:
        total_matches = sum(item["matches"] for item in rates if item["rank"] == tier)

    wrArray = []
    prArray = []
    
    for currentRole in Roles:
        role_data = tier_roles[currentRole]
        for item in role_data:
            total_matches += item['matchCount']
    
    total_matches /= 10
    
    for currentRole in Roles:
        role_data = tier_roles[currentRole]
        for hero_id in hero_ids:
            matches = 0
            wins = 0
            for item in role_data:
                if item['heroId'] == hero_id:
                    matches += item['matchCount']
                    wins += item['winCount']
            if matches > 0:
                PR = matches / total_matches
                WR = wins / matches
                if(PR > 0.005):
                    wrArray.append(WR)
                    prArray.append(PR)
    
    for currentRole in Roles:
        role_data = tier_roles[currentRole]
        for hero_id in hero_ids:
            matches = 0
            wincount = 0
            for item in role_data:
                if item['heroId'] == hero_id:
                    matches += item['matchCount']
                    wincount += item['winCount']
            if matches > 0:
                PR = matches / total_matches
                WR = wincount / matches
                
                if PR > 0.005:
                    sdWR = standardDeviation(wrArray)
                    sdPR = standardDeviation(prArray)
                    zScoreWR = (WR - (sum(wrArray) / len(wrArray)) ) / sdWR
                    zScorePR = (PR - (sum(prArray) / len(prArray)) ) / sdPR

                    if zScoreWR < 0:
                        tier_num = zScoreWR - abs(zScorePR)
                    else:
                        tier_num = zScoreWR + zScorePR

                    tier_str = tierCalc(tier_num)

                else:
                    tier_num = 0
                    tier_str = '?'
                
                updated_rates.append({
                    "hero_id": hero_id,
                    "patch": current_patch,
                    "matches": matches,
                    "wincount": wincount,
                    "winrate": WR,
                    "pickrate": PR,
                    "role": currentRole,
                    "rank": tier,
                    "tier_num": tier_num,
                    "tier_str": tier_str
                })




s3.put_object(Bucket='dotam-content', Key=f"data/{current_patch}/rates.json", Body=json.dumps(updated_rates, indent=2))

by_hero_id = defaultdict(list)

for rate in updated_rates:
    hero_id = rate['hero_id']
    rank = rate['rank']
    by_hero_id[(hero_id, rank)].append(rate)

with ThreadPoolExecutor(max_workers=10) as executor:
    for (hero_id, rank), rates_list in by_hero_id.items():
        executor.submit(s3.put_object, Bucket='dotam-content', Key=f"data/{current_patch}/{hero_id}/rates/{rank}/rates.json", Body=json.dumps(rates_list, indent=2))



print("Done dumping into S3")     
# conn.commit()
# conn.close() # Close communication with the database

client = boto3.client('cloudfront')

response = client.create_invalidation(
    DistributionId='E2UJP3F27QO2FJ',  # Replace with your CloudFront Distribution ID
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



end_time = time.time()
elapsed_time = end_time - start_time
print(f"That took {round((elapsed_time/60), 2)} minutes")


