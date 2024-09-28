#!/usr/bin/env python3

import psycopg2
import json
import requests
import os

from dotenv import load_dotenv

load_dotenv()

#Change the table name for each new patch
table = 'p7_37c'

# My Amazon Database
database_url = os.environ.get('DATABASE_URL')
builds_database_url = os.environ.get('BUILDS_DATABASE_URL')
conn = psycopg2.connect(database_url)
cur = conn.cursor()

cur.execute("SELECT hero_id from heroes;")
hero_ids = [row[0] for row in cur.fetchall()]
conn.close()

print("Got the hero ids")

conn = psycopg2.connect(builds_database_url)
cur = conn.cursor()

cur.execute(f"""
    CREATE TABLE {table} (
        hero_id INT,
        rank VARCHAR(50),
        role VARCHAR(50),
        facet VARCHAR(50),
        total_matches INT DEFAULT 0,
        total_wins INT DEFAULT 0,
        abilities JSONB DEFAULT '[]',
        talents JSONB DEFAULT '[]',
        starting JSONB DEFAULT '[]',
        early JSONB DEFAULT '[]',
        core JSONB DEFAULT '[]'
    )
""")
conn.commit()

print("Created the table")

Roles = ['POSITION_1', 'POSITION_2', 'POSITION_3', 'POSITION_4', 'POSITION_5']
Ranks = ['', 'HERALD', 'GUARDIAN', 'CRUSADER', 'ARCHON', 'LEGEND', 'ANCIENT', 'DIVINE', 'IMMORTAL', 'LOW', 'MID', 'HIGH']
Facets = [1, 2, 3]

print("Initialization Started")
for hero_id in hero_ids:
    for rank in Ranks:
        for role in Roles:
            for facet in Facets:
                cur.execute(f"""
                    INSERT INTO {table} (hero_id, rank, role, facet) 
                    VALUES (%s, %s, %s, %s)
                """, (hero_id, rank, role, facet)
                )
                conn.commit()
conn.close()
print("Initialization Finished")