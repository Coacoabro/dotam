#!/usr/bin/env python3

import time
import psycopg2
import json
import requests
import os
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

cur.execute("SELECT * FROM heroes")
heroes_data = cur.fetchall()
heroes_columns = [desc[0] for desc in cur.description]
heroes_result = [dict(zip(heroes_columns, row)) for row in heroes_data]

cur.execute("SELECT * FROM rates")
rates_data = cur.fetchall()
rates_columns = [desc[0] for desc in cur.description]
rates_result = [dict(zip(rates_columns, row)) for row in rates_data]

cur.execute("SELECT hero_id, rank, role, herovs FROM matchups")
matchups_data = cur.fetchall()
matchups_columns = [desc[0] for desc in cur.description]
matchups_result = [dict(zip(matchups_columns, row)) for row in matchups_data]

# Home
heroes_file = f"./python/content_data/heroes.json"
rates_file = f"./python/content_data/rates.json"
matchups_file = f"./python/content_data/matchups.json"
tier_matchups_file = f"./python/content_data/tier-matchups.json"
directory_path = "./python/content_data"

# # EC2
# heroes_file = f"/home/ec2-user/dotam/python/content_data/heroes.json"
# rates_file = f"/home/ec2-user/dotam/python/content_data/rates.json"
# matchups_file = f"/home/ec2-user/dotam/python/content_data/matchups.json"
# tier_matchups_file = f"/home/ec2-user/dotam/python/content_data/tier-matchups.json"
# directory_path = "/home/ec2-user/dotam/python/content_data"

os.makedirs(directory_path, exist_ok=True)

with open(heroes_file, 'w') as file:
    json.dump(heroes_result, file, indent=2)
with open(rates_file, 'w') as file:
    json.dump(rates_result, file, indent=2)
with open(matchups_file, 'w') as file:
    json.dump(matchups_result, file, indent=2)



# Create the S3 File
s3.upload_file(heroes_file, 'dotam-content', f"data/heroes.json")
s3.upload_file(rates_file, 'dotam-content', f"data/rates.json")
s3.upload_file(matchups_file, 'dotam-content', f"data/matchups.json")

tier_matchups = matchups_result
for matchup in tier_matchups:
    matchup['herovs'] = sorted(matchup['herovs'], key=lambda x: x['WR'])[:5]

with open(tier_matchups_file, 'w') as file:
    json.dump(tier_matchups, file, indent=2)

s3.upload_file(tier_matchups_file, 'dotam-content', f"data/tier-matchups.json")


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