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

res = requests.get("https://dhpoqm1ofsbx7.cloudfront.net/patch.txt")
patch = res.text

client = clickhouse_connect.get_client(
    host=os.getenv('CLICKHOUSE_HOST'),
    user='default',
    password=os.getenv('CLICKHOUSE_KEY'),
    secure=True,
    connect_timeout=60,
    send_receive_timeout=60
)

hero_ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 119, 120, 121, 123, 126, 128, 129, 131, 135, 136, 137, 138, 145]
Ranks = ['', 'LOW', 'MID', 'HIGH']
Roles = ['POSITION_1', 'POSITION_2', 'POSITION_3', 'POSITION_4', 'POSITION_5']
hero_id = 1

TOP_PERMS = 3
TOP_GROUPS = 10

existing_items = defaultdict(lambda: defaultdict(lambda: defaultdict(dict)))

core_rows = list(client.query("""
        SELECT
            hero_id,
            rank,
            role,
            facet,
            core,
            SUM(wins) as total_wins,
            SUM(matches) as total_matches
        FROM core
        WHERE hero_id = %(hero_id)s
        GROUP BY hero_id, rank, role, facet, core
    """, parameters={"hero_id": hero_id}).named_results())


cores_grouped = defaultdict(lambda: defaultdict(lambda: {
    "cores": [],
    "combined_wins": 0,
    "combined_matches": 0
}))

for row in core_rows:
    build_id = (row["hero_id"], row["rank"], row["role"], row["facet"])
    sorted_core = tuple(sorted(row["core"]))

    core_grouped = cores_grouped[build_id][sorted_core]

    core_grouped["cores"].append({
        "core": row["core"],
        "total_wins": row["total_wins"],
        "total_matches": row["total_matches"]
    })
    core_grouped["combined_wins"] += row["total_wins"]
    core_grouped["combined_matches"] += row["total_matches"]


for build_id, cores in cores_grouped.items():

    for sorted_core, data in cores.items():
        data["cores"].sort(
            key=lambda c: (c["total_matches"], c["total_wins"]),
            reverse=True
        )
        data["cores"] = data["cores"][:TOP_PERMS]

    sorted_cores = sorted(
        cores.items(),
        key=lambda item: (item[1]["combined_matches"], item[1]["combined_wins"]),
        reverse=True
    )[:TOP_GROUPS]

    cores_grouped[build_id] = dict(sorted_cores)


core_conditions = []

for (hero_id, rank, role, facet), groups in cores_grouped.items():
    for sorted_core in groups.keys(): 
        core_items = "[" + ",".join(str(x) for x in sorted_core) + "]"
        line = f"({hero_id}, '{rank}', '{role}', {facet}, {core_items})"
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
            arraySort(l.core) AS core,
            l.nth,
            l.item,
            SUM(l.wins)   AS late_total_wins,
            SUM(l.matches) AS late_total_matches,
            ROW_NUMBER() OVER (
                PARTITION BY
                    l.hero_id,
                    l.rank,
                    l.role,
                    l.facet,
                    arraySort(l.core),
                    l.nth
                ORDER BY
                    SUM(l.matches) DESC,
                    SUM(l.wins) DESC
            ) AS rn
        FROM late l
        INNER JOIN core_keys tc
            ON l.hero_id = tc.hero_id
            AND l.rank    = tc.rank
            AND l.role    = tc.role
            AND l.facet   = tc.facet
            AND arraySort(l.core) = tc.core
        GROUP BY
            l.hero_id,
            l.rank,
            l.role,
            l.facet,
            arraySort(l.core),
            l.nth,
            l.item
    )
    SELECT *
    FROM top_late
    WHERE rn <= 10
""").named_results())

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

for (hero_id, rank, role, facet), core_groups in cores_grouped.items():
    
    facet_str = str(facet)

    if "core" not in existing_items[rank][role][facet_str]:
        existing_items[rank][role][facet_str]["core"] = []
    

    for sorted_core, data in core_groups.items():
        late_key = (hero_id, rank, role, facet_str, sorted_core)
        late_for_core = late_grouped.get(late_key, {})

        existing_items[rank][role][facet_str]["core"].append({
            'SortedCore': list(sorted_core),
            'CombinedWins': data['combined_wins'],
            'CombinedMatches': data['combined_matches'],
            'Permutations': data['cores'],
            'Late': late_for_core
        })

sorted_items = {}

for rank in Ranks:
    sorted_items = {role: existing_items[rank][role] for role in Roles if role in existing_items[rank]}

with open("test.json", "w") as f:
    json.dump(sorted_items, f, indent=4)

