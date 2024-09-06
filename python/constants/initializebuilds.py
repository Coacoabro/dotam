#!/usr/bin/env python3

import time
import psycopg2
import json
import requests
import os

from dotenv import load_dotenv

load_dotenv()

# Steam's Web API
API_KEY_1 = os.environ.get('DOTA_API_KEY')
API_KEY = API_KEY_1
SEQ_URL = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistoryBySequenceNum/v1/?key=' + API_KEY + '&start_at_match_seq_num='    

# My Amazon Database
database_url = os.environ.get('DATABASE_URL')
conn = psycopg2.connect(database_url)
cur = conn.cursor() # Open a cursor to perform database operations

patch = '7.37c'

Roles = ['POSITION_1', 'POSITION_2', 'POSITION_3', 'POSITION_4', 'POSITION_5']
Ranks = ['', 'HERALD', 'GUARDIAN', 'CRUSADER', 'ARCHON', 'LEGEND', 'ANCIENT', 'DIVINE', 'IMMORTAL', 'LOW', 'MID', 'HIGH']
Facets = [1, 2, 3]
cur.execute("SELECT hero_id from heroes;")
hero_ids = [row[0] for row in cur.fetchall()]
print("Initialization Started")
# for hero_id in hero_ids:
hero_id = 131
for rank in Ranks:
    for role in Roles:
        for facet in Facets:
            cur.execute("""
                INSERT INTO builds (hero_id, patch, rank, role, facet, total_matches, total_wins, abilities, talents, starting, early, core, item01, item02, item03, item04, item05, item06, item07, item08, item09, item10, boots) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (hero_id, patch, rank, role, facet, 0, 0, json.dumps([]), json.dumps([]), json.dumps([]), json.dumps([]), json.dumps([]), json.dumps([]), json.dumps([]), json.dumps([]), json.dumps([]), json.dumps([]), json.dumps([]), json.dumps([]), json.dumps([]), json.dumps([]), json.dumps([]), json.dumps([]))
            )
            conn.commit() 
conn.close()
print("Initialization Finished")