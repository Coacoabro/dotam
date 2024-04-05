#!/usr/bin/env python3

from collections import Counter
from dotenv import load_dotenv

import os
import psycopg2
import json
import requests

load_dotenv()

database_url = os.environ.get('DATABASE_URL')
graphql_token = os.environ.get('NEXT_PUBLIC_REACT_APP_TOKEN')

url = 'https://api.stratz.com/graphql' #GraphQL Endpoint
headers = {'Authorization': f'Bearer {graphql_token}'}

conn = psycopg2.connect(database_url)
cur = conn.cursor() # Open a cursor to perform database operations

cur.execute("SELECT hero_id from heroes;")
hero_ids = [row[0] for row in cur.fetchall()]

ranks = [] #You're gonna need to create the typical rank and role split
roles = []


for hero_id in hero_ids:
    query = f"""
        query{{
            heroStats {{
                heroVsHeroMatchup(heroId: {hero_id}, bracketBasicIds: {ranks}, positionIds: {roles}) {{
                    advantage {{
                        vs {{
                            heroId2
                            winRateHeroId2
                            matchCount
                        }}
                        with {{
                            heroId2
                            winCount
                            matchCount
                        }}
                    }}
                }}
            }}
        }}
    """