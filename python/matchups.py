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

ranks = ['', 'HERALD_GUARDIAN', 'CRUSADER_ARCHON', 'LEGEND_ANCIENT', 'DIVINE_IMMORTAL']


for hero_id in hero_ids:
    for rank in ranks:
        query = f"""
            query{{
                heroStats {{
                    heroVsHeroMatchup(
                        {'heroId: ' + str(hero_id)}
                        {'bracketBasicIds: ' + rank if rank else ''}
                    ) {{
                        advantage {{
                            vs {{
                                heroId2
                                winCount
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

        response = requests.post(url, headers=headers, json={'query': query})
        data = json.loads(response.text)

        matchupsVs = data['data']['heroStats']['heroVsHeroMatchup']['advantage'][0]['vs']
        matchupsWith = data['data']['heroStats']['heroVsHeroMatchup']['advantage'][0]['with']

        

