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

from dotenv import load_dotenv

load_dotenv()

s3 = boto3.client('s3')

# My Amazon Database
database_url = os.environ.get('DATABASE_URL')
builds_database_url = os.environ.get('BUILDS_DATABASE_URL')

# Getting all hero ids
conn = psycopg2.connect(database_url)
cur = conn.cursor()
cur.execute("SELECT hero_id from heroes;")
hero_ids = [row[0] for row in cur.fetchall()]
conn.close()

# Getting patch info
res = requests.get("https://dhpoqm1ofsbx7.cloudfront.net/patch.txt")
patch = res.text


def fetch_builds_for_hero(hero_id, patch):
    cur.execute('SELECT * FROM main WHERE hero_id = %s AND patch = %s', (hero_id, patch))
    main = cur.fetchall()
    build_ids = [row[0] for row in main] # Assuming build_id is the first column in the main table

    # Query abilities, talents, and items in parallel
    abilities_query = """
        SELECT * FROM (
            SELECT *, ROW_NUMBER() OVER (PARTITION BY build_id ORDER BY matches DESC) AS rn
            FROM abilities
            WHERE build_id = ANY(%s)
        ) AS ranked WHERE rn <= 10 ORDER BY build_id, rn
    """
    talents_query = "SELECT * FROM talents WHERE build_id = ANY(%s) ORDER BY build_id;"
    starting_query = """
        SELECT * FROM (
            SELECT *, ROW_NUMBER() OVER (PARTITION BY build_id ORDER BY matches DESC) AS rn
            FROM starting
            WHERE build_id = ANY(%s)
        ) AS ranked
        WHERE rn <= 10
        ORDER BY build_id, rn
    """
    early_query = """
        SELECT * FROM (
            SELECT *, ROW_NUMBER() OVER (PARTITION BY build_id ORDER BY matches DESC) AS rn
            FROM early
            WHERE build_id = ANY(%s)
        ) AS ranked
        WHERE rn <= 10
        ORDER BY build_id, rn
    """
    core_query = """
        SELECT * FROM (
            SELECT *, ROW_NUMBER() OVER (PARTITION BY build_id ORDER BY matches DESC) AS rn
            FROM core
            WHERE build_id = ANY($1::int[])
        ) AS ranked
        WHERE rn <= 10
        ORDER BY build_id, rn
    """

    cur.execute(abilities_query, (build_ids,))
    abilities_data = cur.fetchall()

    cur.execute(talents_query, (build_ids,))
    talents_data = cur.fetchall()

    cur.execute(starting_query, (build_ids,))
    starting_data = cur.fetchall()

    cur.execute(early_query, (build_ids,))
    early_data = cur.fetchall()

    cur.execute(core_query, (build_ids,))
    core_data = cur.fetchall()

    

    # Process core items into lists
    core_items_by_build_id = {}
    for item in core_data:
        build_id = item[0]  # Assuming build_id is the first column
        if build_id not in core_items_by_build_id:
            core_items_by_build_id[build_id] = []
        core_items_by_build_id[build_id].append(item[1])  # Assuming core items are in the second column

    core_items_list = [core_items_by_build_id.get(build_id, []) for build_id in build_ids]

    # Query late items
    query_parts = []
    query_params = []
    for build_id, core_items in zip(build_ids, core_items_list):
        for core in core_items:
            query_parts.append(f"(build_id = %s AND core_items = %s)")
            query_params.extend([build_id, core])

    where_condition = " OR ".join(query_parts)
    late_items_query = f"""
        SELECT * FROM (
            SELECT *, ROW_NUMBER() OVER (PARTITION BY build_id, core_items, nth ORDER BY matches DESC, wins DESC) AS rn
            FROM late
            WHERE ({where_condition}) AND nth IN (3, 4, 5, 6, 7, 8, 9)
        ) AS ranked WHERE rn <= 10 ORDER BY build_id, core_items, nth, matches DESC, wins DESC;
    """
    cur.execute(late_items_query, query_params)
    late_items_data = cur.fetchall()

    # Merge late items with core items
    for item in core_items_data:
        build_id = item[0]  # Assuming build_id is in the first column
        core = item[1]      # Assuming core_items is in the second column
        late_items = [row for row in late_items_data if row[0] == build_id and row[1] == core]
        item.append(late_items)

    # Build final data structure for each build
    build_data = []
    for build in main:
        build_id = build[0]  # Assuming build_id is in the first column
        build_info = {
            "build_id": build_id,
            "rank": build[1],  # Adjust column numbers as per your table schema
            "role": build[2],
            "facet": build[3],
            "patch": build[4],
            "total_matches": build[5],
            "total_wins": build[6],
            "abilities": [a for a in abilities_data if a[0] == build_id],  # Filter by build_id
            "talents": [t for t in talents_data if t[0] == build_id],
            "items": {
                "starting": [s for s in starting_items_data if s[0] == build_id],
                "early": [e for e in early_items_data if e[0] == build_id],
                "core": [c for c in core_items_data if c[0] == build_id]
            }
        }
        build_data.append(build_info)

    return build_data


for hero_id in hero_ids:
    build_data = fetch_builds_for_hero(hero_id, patch)
    file_name = f"hero_id={hero_id}.json"
    
    # Write to local file
    with open(file_name, 'w') as file:
        json.dump(build_data, file, indent=2)

    # Optionally, upload to S3
    s3.upload_file(file_name, 'your_bucket_name', f"builds/{file_name}")

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