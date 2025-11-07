#!/usr/bin/env python3

import time
import psycopg2
import boto3
import json
import requests
import os
import clickhouse_connect

from dotenv import load_dotenv
from botocore.config import Config
from collections import defaultdict
from datetime import date, datetime, timezone

load_dotenv()

start_time = time.time()

# S3 Bucket

config = Config(
    connect_timeout=5,
    read_timeout=60,
    retries={
        'max_attempts': 3,
        'mode': 'standard'
    }
)
s3 = boto3.client('s3', config=config)

# My Amazon Database
database_url = os.environ.get('DATABASE_URL')

res = requests.get("https://dhpoqm1ofsbx7.cloudfront.net/patch.txt")
patch = res.text

client = clickhouse_connect.get_client(
    host=os.getenv('CLICKHOUSE_HOST'),
    user='default',
    password=os.getenv('CLICKHOUSE_KEY'),
    secure=True
)

# result = client.query('SELECT hero_id FROM heroes')
# rows = result.result_rows
# hero_ids = [row[0] for row in rows]

hero_ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 119, 120, 121, 123, 126, 128, 129, 131, 135, 136, 137, 138, 145]


# Telegram Stuff
def send_telegram_message(message):

    bot_token = os.getenv('BOT_TOKEN')
    chat_id = os.getenv('CHAT_ID')

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message
    }
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        print("Telegram notification sent!")
    else:
        print(f"Failed to send Telegram message: {response.status_code} - {response.text}")



# Ranks = ['', 'HERALD', 'GUARDIAN', 'CRUSADER', 'ARCHON', 'LEGEND', 'ANCIENT', 'DIVINE', 'IMMORTAL', 'LOW', 'MID', 'HIGH']
## Right now taking away specific ranks and only doing ALL HIGH MID and LOW
Ranks = ['', 'LOW', 'MID', 'HIGH']
Roles = ['POSITION_1', 'POSITION_2', 'POSITION_3', 'POSITION_4', 'POSITION_5']


try:
    for hero_id in hero_ids:
        
        existing_summary = defaultdict(lambda: defaultdict(lambda: defaultdict(dict)))
        existing_abilities = defaultdict(lambda: defaultdict(lambda: defaultdict(dict)))
        existing_items = defaultdict(lambda: defaultdict(lambda: defaultdict(dict)))
        existing_builds = defaultdict(lambda: defaultdict(lambda: defaultdict(dict)))

        main_rows = list(client.query("""
            SELECT * FROM (
                SELECT    
                    hero_id,
                    rank,
                    role,
                    facet,
                    SUM(wins) as total_wins,
                    SUM(matches) as total_matches     
                FROM main
                WHERE hero_id = %(hero_id)s
                GROUP BY hero_id, rank, role, facet        
                )
        """, parameters={"hero_id": hero_id}).named_results())

        ability_rows = list(client.query("""
            SELECT *
                FROM (
                    SELECT
                        hero_id,
                        rank,
                        role,
                        facet,
                        abilities,
                        SUM(wins) as total_wins,
                        SUM(matches) as total_matches,
                        ROW_NUMBER() OVER (
                            PARTITION BY hero_id, rank, role, facet
                            ORDER BY SUM(matches) DESC, SUM(wins) DESC
                        ) AS rn
                    FROM abilities
                    WHERE hero_id = %(hero_id)s
                    GROUP BY hero_id, rank, role, facet, abilities
                )
            WHERE rn <= 10
        """, parameters={"hero_id": hero_id}).named_results())

        talent_rows = list(client.query("""
            SELECT *
                FROM (
                    SELECT
                        hero_id,
                        rank,
                        role,
                        facet,
                        talent,
                        SUM(wins) as total_wins,
                        SUM(matches) as total_matches
                    FROM talents
                    WHERE hero_id = %(hero_id)s
                    GROUP BY hero_id, rank, role, facet, talent
                )
        """, parameters={"hero_id": hero_id}).named_results())

        starting_rows = list(client.query("""
            SELECT *
                FROM (
                    SELECT
                        hero_id,
                        rank,
                        role,
                        facet,
                        starting,
                        SUM(wins) as total_wins,
                        SUM(matches) as total_matches,
                        ROW_NUMBER() OVER (
                            PARTITION BY hero_id, rank, role, facet
                            ORDER BY SUM(matches) DESC, SUM(wins) DESC
                        ) AS rn
                    FROM starting
                    WHERE hero_id = %(hero_id)s
                    GROUP BY hero_id, rank, role, facet, starting
                )
            WHERE rn <= 5
        """, parameters={"hero_id": hero_id}).named_results())

        early_rows = list(client.query("""
            SELECT *
                FROM (
                    SELECT
                        hero_id,
                        rank,
                        role,
                        facet,
                        item,
                        issecond,
                        SUM(wins) as total_wins,
                        SUM(matches) as total_matches,
                        ROW_NUMBER() OVER (
                            PARTITION BY hero_id, rank, role, facet
                            ORDER BY SUM(matches) DESC, SUM(wins) DESC
                        ) AS rn
                    FROM early
                    WHERE hero_id = %(hero_id)s
                    GROUP BY hero_id, rank, role, facet, item, issecond
                )
            WHERE rn <= 10
        """, parameters={"hero_id": hero_id}).named_results())

        core_rows = list(client.query("""
            SELECT *
                FROM (
                    SELECT
                        hero_id,
                        rank,
                        role,
                        facet,
                        core,
                        SUM(wins) as total_wins,
                        SUM(matches) as total_matches,
                        ROW_NUMBER() OVER (
                            PARTITION BY hero_id, rank, role, facet
                            ORDER BY SUM(matches) DESC, SUM(wins) DESC
                        ) AS rn
                    FROM core
                    WHERE hero_id = %(hero_id)s
                    GROUP BY hero_id, rank, role, facet, core
                )
                WHERE rn <= 10
            """, parameters={"hero_id": hero_id}).named_results())
        
        core_conditions = []
        if core_rows:
            for row in core_rows:
                core_items = "[" + ",".join(str(x) for x in row["core"]) + "]"
                line = f"({row['hero_id']}, '{row['rank']}', '{row['role']}', {row['facet']}, {core_items})"
                core_conditions.append(line)
            core_values_clause = ",\n".join(core_conditions)
        

            late_rows = list(client.query(f"""
                WITH core_keys AS (
                    SELECT * FROM (
                        SELECT * FROM VALUES (
                            {core_values_clause} 
                        )                   
                    ) AS core_keys (hero_id, rank, role, facet, core)
                ),
                top_late AS (
                    SELECT
                        l.hero_id,
                        l.rank,
                        l.role,
                        l.facet,
                        l.core,
                        l.nth,
                        l.item,
                        SUM(l.wins) AS late_total_wins,
                        SUM(l.matches) AS late_total_matches,
                        ROW_NUMBER() OVER (
                            PARTITION BY l.hero_id, l.rank, l.role, l.facet, l.core, l.nth
                            ORDER BY SUM(l.matches) DESC, SUM(l.wins) DESC
                        ) AS rn
                    FROM late l
                    INNER JOIN core_keys tc
                        ON l.hero_id = tc.hero_id
                        AND l.rank = tc.rank
                        AND l.role = tc.role
                        AND l.facet = tc.facet
                        AND l.core = tc.core
                    GROUP BY l.hero_id, l.rank, l.role, l.facet, l.core, l.nth, l.item
                )
                SELECT *
                FROM top_late
                WHERE rn <= 10
            """, parameters={"hero_id": hero_id}).named_results())
        
        else:
            late_rows = []


        neutral_rows = list(client.query("""
            SELECT *
                FROM (
                    SELECT
                        hero_id,
                        rank,
                        role,
                        facet,
                        tier,
                        item,
                        SUM(wins) as total_wins,
                        SUM(matches) as total_matches,
                        ROW_NUMBER() OVER (
                            PARTITION BY hero_id, rank, role, facet, tier
                            ORDER BY SUM(matches) DESC, SUM(wins) DESC
                        ) AS rn
                    FROM neutrals
                    WHERE hero_id = %(hero_id)s
                    GROUP BY hero_id, rank, role, facet, tier, item
                )
            WHERE rn <= 10
        """, parameters={"hero_id": hero_id}).named_results())

        for row in main_rows:
            rank = row['rank']
            role = row['role']
            facet = str(row['facet'])

            existing_summary[rank][role][facet] = {
                "total_matches": row['total_matches'],
                "total_wins": row['total_wins']
            }

            


        for row in ability_rows:
            rank = row['rank']
            role = row['role']
            facet = str(row['facet'])

            if "abilities" not in existing_abilities[rank][role][facet]:
                existing_abilities[rank][role][facet]["abilities"] = []

            existing_abilities[rank][role][facet]["abilities"].append({
                "Abilities": row["abilities"],
                "Wins": row["total_wins"],
                "Matches": row["total_matches"]
            })
            
        for row in talent_rows:
            rank = row['rank']
            role = row['role']
            facet = str(row['facet'])

            if "talents" not in existing_abilities[rank][role][facet]:
                existing_abilities[rank][role][facet]["talents"] = []

            existing_abilities[rank][role][facet]["talents"].append({
                "Talent": row["talent"],
                "Wins": row["total_wins"],
                "Matches": row["total_matches"]
            })

        for row in starting_rows:
            rank = row['rank']
            role = row['role']
            facet = str(row['facet'])

            if "starting" not in existing_items[rank][role][facet]:
                existing_items[rank][role][facet]["starting"] = []
            
            existing_items[rank][role][facet]["starting"].append({
                "Starting": row["starting"],
                "Wins": row["total_wins"],
                "Matches": row["total_matches"]
            })
        
        for row in early_rows:
            rank = row['rank']
            role = row['role']
            facet = str(row['facet'])

            if "early" not in existing_items[rank][role][facet]:
                existing_items[rank][role][facet]["early"] = []
            
            existing_items[rank][role][facet]["early"].append({
                "Item": row["item"],
                "isSecondPurchase": row["issecond"],
                "Wins": row["total_wins"],
                "Matches": row["total_matches"]
            })
        
        late_grouped = defaultdict(lambda: defaultdict(list))
        for late in late_rows:
            key = (late['hero_id'], late['rank'], late['role'], str(late['facet']), tuple(late['core']))
            nth = late['nth']
            late_entry = {
                'Item': late['item'],
                'Matches': late['late_total_matches'],
                'Wins': late['late_total_wins']
            }
            late_grouped[key][nth].append(late_entry)

        for row in core_rows:
            
            rank = row['rank']
            role = row['role']
            facet = str(row['facet'])
            key = (hero_id, rank, role, facet, tuple(row['core']))
            late_for_core = late_grouped.get(key, {})

            if "core" not in existing_items[rank][role][facet]:
                existing_items[rank][role][facet]["core"] = []
            
            existing_items[rank][role][facet]["core"].append({
                'Core': row['core'],
                'Wins': row['total_wins'],
                'Matches': row['total_matches'],
                'Late': late_for_core
            })
            
        for row in neutral_rows:
            rank = row['rank']
            role = row['role']
            facet = str(row['facet'])

            if "neutrals" not in existing_items[rank][role][facet]:
                existing_items[rank][role][facet]["neutrals"] = []
            
            existing_items[rank][role][facet]["neutrals"].append({
                "Item": row["item"],
                "Tier": row["tier"],
                "Wins": row["total_wins"],
                "Matches": row["total_matches"]
            })

        for rank in Ranks:

            sorted_summary = {role: existing_summary[rank][role] for role in Roles if role in existing_summary[rank]}
            summary_s3_key = f"data/{patch}/{hero_id}/{rank}/summary.json"
            s3.put_object(Bucket='dotam-builds', Key=summary_s3_key, Body=json.dumps(sorted_summary, indent=None))

            sorted_abilities = {role: existing_abilities[rank][role] for role in Roles if role in existing_abilities[rank]}
            abilities_s3_key = f"data/{patch}/{hero_id}/{rank}/abilities.json"
            s3.put_object(Bucket='dotam-builds', Key=abilities_s3_key, Body=json.dumps(sorted_abilities, indent=None))

            sorted_items = {role: existing_items[rank][role] for role in Roles if role in existing_items[rank]}
            items_s3_key = f"data/{patch}/{hero_id}/{rank}/items.json"
            s3.put_object(Bucket='dotam-builds', Key=items_s3_key, Body=json.dumps(sorted_items, indent=None))

            

            for role, facets in sorted_abilities.items():
                for facet, results in facets.items():
                    if "abilities" in results:
                        existing_builds[role][facet]["abilities"] = results["abilities"][0]
                    if "talents" in results:
                        existing_builds[role][facet]["talents"] = results["talents"]
                    existing_builds[role][facet]["items"] = {
                        "starting": {},
                        "early": [],
                        "core": [],
                        "neutrals": []
                    }
            
            for role, facets in sorted_items.items():
                for facet, results in facets.items(): 
                    if "starting" in results:
                        existing_builds[role][facet]["items"]["starting"] = results["starting"][0]
                    if "early" in results:
                        existing_builds[role][facet]["items"]["early"] = results["early"][:6]
                    if "core" in results:
                        existing_builds[role][facet]["items"]["core"] = results["core"][:3]
                    if "neutrals" in results:
                        existing_builds[role][facet]["items"]["neutrals"] = results["neutrals"]
            
            builds_s3_key = f"data/{patch}/{hero_id}/{rank}/builds.json"
            s3.put_object(Bucket='dotam-builds', Key=builds_s3_key, Body=json.dumps(existing_builds, indent=None))

        print("Done: ", hero_id)

    ## Make Sure Everythings Up to Date
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

    end_time = time.time()
    elapsed_time = end_time - start_time

    time_message = f"Finished sending to CDN. That took {round((elapsed_time/60), 2)} minutes"
    send_telegram_message(time_message)

except Exception as e:
    error_message = f"An error occurred in your script:\n\n{str(e)}"
    print(error_message)
    send_telegram_message(error_message)
    

