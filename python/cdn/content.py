#!/usr/bin/env python3

import time
import psycopg2
import json
import requests
import os
import psutil
import copy
import boto3
import datetime

from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

s3 = boto3.client('s3')

# My Amazon Database
database_url = os.environ.get('DATABASE_URL')

conn = psycopg2.connect(database_url)
cur = conn.cursor()
cur.execute("SELECT hero_id from heroes;")
hero_ids = [row[0] for row in cur.fetchall()]

# Getting patch info
res = requests.get("https://dhpoqm1ofsbx7.cloudfront.net/patch.txt")
patch = res.text


for hero_id in hero_ids:

    print(hero_id)

    cur.execute("SELECT * FROM heroes WHERE hero_id = %s", [hero_id])
    hero = cur.fetchall()
    hero = hero[0]
    heroObj = {}
    heroObj['hero_id'] = hero[0]
    heroObj['name'] = hero[1]
    heroObj['localized_name'] = hero[2]
    heroObj['img'] = hero[3]
    heroObj['attr'] = hero[4]

    cur.execute("SELECT * FROM rates WHERE hero_id = %s AND patch = %s", [hero_id, patch])
    rates = cur.fetchall()
    hero_rates = []
    for rate in rates:
        heroRate = {}
        heroRate['hero_id'] = rate[0]
        heroRate['patch'] = rate[1]
        heroRate['matches'] = rate[2]
        heroRate['wincount'] = rate[3]
        heroRate['winrate'] = rate[4]
        heroRate['pickrate'] = rate[5]
        heroRate['role'] = rate[6]
        heroRate['rank'] = rate[7]
        heroRate['tier_num'] = rate[8]
        heroRate['tier_str'] = rate[9]
        hero_rates.append(heroRate)

    hero_matchups = {}
    cur.execute("SELECT * FROM matchups WHERE hero_id = %s", [hero_id])
    matchups = cur.fetchall()
    hero_matchups = []
    for matchup in matchups:
        heroMatchup = {}
        heroMatchup['hero_id'] = matchup[0]
        heroMatchup['rank'] = matchup[1]
        heroMatchup['role'] = matchup[4]
        heroMatchup['herovs'] = matchup[2]
        heroMatchup['herowith'] = matchup[3]
        hero_matchups.append(heroMatchup)
    
    patch_file_name = patch.replace('.', '_')
    # Home
    # info_file = f"./python/content_data/{patch_file_name}/{hero_id}/info.json"
    # rate_file = f"./python/content_data/{patch_file_name}/{hero_id}/rates.json"
    # matchups_file = f"./python/content_data/{patch_file_name}/{hero_id}/matchups.json"
    # EC2
    info_file = f"/home/ec2-user/dotam/python/content_data/{patch_file_name}/{hero_id}/info.json"
    rate_file = f"/home/ec2-user/dotam/python/content_data/{patch_file_name}/{hero_id}/rates.json"
    matchups_file = f"/home/ec2-user/dotam/python/content_data/{patch_file_name}/{hero_id}/matchups.json"

    directory_path = f"/home/ec2-user/dotam/python/content_data/{patch_file_name}/{hero_id}"
    os.makedirs(directory_path, exist_ok=True)

    # Write to local file
    with open(info_file, 'w') as file:
        json.dump(heroObj, file, indent=2)
    with open(rate_file, 'w') as file:
        json.dump(hero_rates, file, indent=2)
    with open(matchups_file, 'w') as file:
        json.dump(hero_matchups, file, indent=2)

    s3.upload_file(info_file, 'dotam-content', f"data/{patch_file_name}/{hero_id}/info.json")
    s3.upload_file(rate_file, 'dotam-content', f"data/{patch_file_name}/{hero_id}/rates.json")
    s3.upload_file(matchups_file, 'dotam-content', f"data/{patch_file_name}/{hero_id}/matchups.json")
    
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