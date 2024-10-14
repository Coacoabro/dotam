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

conn = psycopg2.connect(builds_database_url)
cur = conn.cursor()

for hero_id in hero_ids:

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
            WHERE build_id = ANY(%s)
        ) AS ranked
        WHERE rn <= 10
        ORDER BY build_id, rn
    """

    cur.execute(abilities_query, (build_ids,))
    abilities_data = cur.fetchall()
    abilitiesFinal = []
    for abilities in abilities_data:
        abilitiesObj = {}
        abilitiesObj['build_id'] = abilities[0]
        abilitiesObj['abilities'] = abilities[1]
        abilitiesObj['wins'] = abilities[2]
        abilitiesObj['matches'] = abilities[3]
        abilitiesFinal.append(abilitiesObj)

    cur.execute(talents_query, (build_ids,))
    talents_data = cur.fetchall()
    talentsFinal = []
    for talents in talents_data:
        talentsObj = {}
        talentsObj['build_id'] = talents[0]
        talentsObj['talent'] = talents[1]
        talentsObj['wins'] = talents[2]
        talentsObj['matches'] = talents[3]
        talentsFinal.append(talentsObj)

    cur.execute(starting_query, (build_ids,))
    starting_data = cur.fetchall()
    startingFinal = []
    for starting in starting_data:
        startingObj = {}
        startingObj['build_id'] = starting[0]
        startingObj['starting'] = starting[1]
        startingObj['wins'] = starting[2]
        startingObj['matches'] = starting[3]
        startingFinal.append(startingObj)

    cur.execute(early_query, (build_ids,))
    early_data = cur.fetchall()
    earlyFinal = []
    for early in early_data:
        earlyObj = {}
        earlyObj['build_id'] = early[0]
        earlyObj['item'] = early[1]
        earlyObj['secondpurchase'] = early[2]
        earlyObj['wins'] = early[3]
        earlyObj['matches'] = early[4]
        earlyFinal.append(earlyObj)

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
    coreFinal = []
    for item in core_data:
        coreObj = {}
        coreObj['build_id'] = item[0]
        coreObj['core'] = item[1]
        coreObj['wins'] = item[2]
        coreObj['matches'] = item[3]
        late_items = [row for row in late_items_data if row[0] == item[0] and row[1] == item[1]] # matching build_id and core
        lateFinal = []
        for lateItem in late_items:
            lateObj = {}
            lateObj['build_id'] = lateItem[0]
            lateObj['core_items'] = lateItem[1]
            lateObj['nth'] = lateItem[2]
            lateObj['item'] = lateItem[3]
            lateObj['wins'] = lateItem[4]
            lateObj['matches'] = lateItem[5]
            lateFinal.append(lateObj)
        coreObj['late'] = lateFinal
        coreFinal.append(coreObj)

    # Build final data structure for each build
    build_data = []
    abilities_data = []
    items_data = []
    for build in main:
        build_id = build[0]
        rank = build[2]
        role = build[3]
        facet = build[4]
        patch = build[5]
        total_matches = build[6]
        total_wins = build[7]
        # Filter by build_id
        abilities_array = [a for a in abilitiesFinal if a['build_id'] == build_id]
        talents_array = [t for t in talentsFinal if t['build_id'] == build_id]
        starting_array = [s for s in startingFinal if s['build_id'] == build_id]
        early_array = [e for e in earlyFinal if e['build_id'] == build_id]
        core_array = [c for c in coreFinal if c['build_id'] == build_id]

        abilities_info = {
            "build_id": build_id,
            "rank": rank,
            "role": role,
            "facet": facet,
            "patch": patch,
            "total_matches": total_matches,
            "total_wins": total_wins,
            "abilities": abilities_array,
            "talents": talents_array
        }
        abilities_data.append(abilities_info)

        items_info = {
            "build_id": build_id,
            "rank": rank,
            "role": role,
            "facet": facet,
            "patch": patch,
            "total_matches": total_matches,
            "total_wins": total_wins,
            "starting": starting_array,
            "early": early_array,
            "core": core_array
        }
        items_data.append(items_info)

        build_core = core_array[:3]

        for cores in build_core:
            newLate = []
            n = 3 if role == "POSITION_4" or role == "POSITION_5" else 4
            end = n + 7
            while n < end:
                filteredLate = [l for l in cores['late'] if l['nth'] == n]
                newLate.append(filteredLate[:3])
                n += 1
            cores['late'] = newLate

        build_info = {
            "build_id": build_id,
            "rank": rank,
            "role": role,
            "facet": facet,
            "patch": patch,
            "total_matches": total_matches,
            "total_wins": total_wins,
            "abilities": abilities_array[0] if len(abilities_array) > 0 else None,
            "talents": talents_array,
            "items": {
                "starting": starting_array[0] if len(starting_array) > 0 else None,
                "early": early_array[:6] if len(early_array) > 0 else None,
                "core": build_core if len(core_array) > 0 else None
            }
        }
        build_data.append(build_info)

        

    patch_file_name = patch.replace('.', '_')
    build_file = f"./python/build_data/{patch_file_name}/{hero_id}/builds.json"
    abilities_file = f"./python/build_data/{patch_file_name}/{hero_id}/abilities.json"
    items_file = f"./python/build_data/{patch_file_name}/{hero_id}/items.json"
    
    directory_path = f"./python/build_data/{patch_file_name}/{hero_id}"
    os.makedirs(directory_path, exist_ok=True)

    # Write to local file
    with open(build_file, 'w') as file:
        json.dump(build_data, file, indent=2)
    with open(abilities_file, 'w') as file:
        json.dump(abilities_data, file, indent=2)
    with open(items_file, 'w') as file:
        json.dump(items_data, file, indent=2)

    # Create the S3 File
    s3.upload_file(build_file, 'dotam-builds', f"data/{patch_file_name}/{hero_id}/builds.json")
    s3.upload_file(abilities_file, 'dotam-builds', f"data/{patch_file_name}/{hero_id}/abilities.json")
    s3.upload_file(items_file, 'dotam-builds', f"data/{patch_file_name}/{hero_id}/items.json")


# Reinitialize cloudfront so old data isn't stored on peoples cache

client = boto3.client('cloudfront')

response = client.create_invalidation(
    DistributionId='E3TU5F95XHEEA',  # Replace with your CloudFront Distribution ID
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