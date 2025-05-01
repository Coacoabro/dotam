#!/usr/bin/env python3

import psycopg2
import json
import requests
import os
import time
import boto3
import datetime

start_time = time.time()

from dotenv import load_dotenv
from datetime import datetime
from botocore.exceptions import ClientError
from concurrent.futures import ThreadPoolExecutor

load_dotenv()

response = requests.get("https://dhpoqm1ofsbx7.cloudfront.net/patch.txt")
current_patch = response.text
database_url = os.environ.get('DATABASE_URL')
graphql_token = os.environ.get('NEXT_PUBLIC_REACT_APP_TOKEN')

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

url = 'https://api.stratz.com/graphql' #GraphQL Endpoint
headers = {'Authorization': f'Bearer {graphql_token}', 'User-Agent': 'STRATZ_API'}

conn = psycopg2.connect(database_url)
cur = conn.cursor() # Open a cursor to perform database operations
cur.execute("SELECT hero_id from heroes;")
hero_ids = [row[0] for row in cur.fetchall()]


s3 = boto3.client('s3')

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

with ThreadPoolExecutor(max_workers=10) as executor:

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

                    hero_rates = {
                        "matches": matches,
                        "wincount": wincount,
                        "winrate": winrate,
                        "pickrate": pickrate,
                        "role": currentRole,
                        "rank": currentRank,
                        "tier_num": tier_num,
                        "tier_str": tier_str
                    }



                    print(hero_id, currentRole, currentRank)

                    executor.submit(s3.put_object, Bucket='dotam-content', Key=f"data/{current_patch}/{hero_id}/rates/{currentRank}/{currentRole}/rates.json", Body=json.dumps(hero_rates, indent=2))


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
                        "winrate": winrate,
                        "pickrate": pickrate,
                        "role": currentRole,
                        "rank": tier,
                        "tier_num": tier_num,
                        "tier_str": tier_str
                    })

                    hero_rates = {
                        "matches": matches,
                        "wincount": wincount,
                        "winrate": winrate,
                        "pickrate": pickrate,
                        "role": currentRole,
                        "rank": tier,
                        "tier_num": tier_num,
                        "tier_str": tier_str
                    }
                    print(hero_id, currentRole, tier)

                    executor.submit(s3.put_object, Bucket='dotam-content', Key=f"data/{current_patch}/{hero_id}/rates/{tier}/{currentRole}/rates.json", Body=json.dumps(hero_rates, indent=2))





s3.put_object(Bucket='dotam-content', Key=f"data/{current_patch}/rates.json", Body=json.dumps(updated_rates, indent=2))
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


