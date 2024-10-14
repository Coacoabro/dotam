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

cur.execute("SELECT * FROM heroes")
heroes = cur.fetchall()
cur.execute("SELECT * FROM rates WHERE patch=%s", [patch])
rates = cur.fetchall()
cur.execut("SELECT hero_id, rank, role, herovs FROM matchups")



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