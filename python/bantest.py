#!/usr/bin/env python3

from collections import Counter
from dotenv import load_dotenv

import os
import psycopg2
import json
import requests

load_dotenv()

graphql_token = os.environ.get('NEXT_PUBLIC_REACT_APP_TOKEN')

url = 'https://api.stratz.com/graphql' #GraphQL Endpoint
headers = {'Authorization': f'Bearer {graphql_token}'}

query = """
    query {
        heroStats {
            banDay(heroId: 1) {
                heroId
                matchCount
            }
        }
    }
"""

response = requests.post(url, headers=headers, json={'query': query})
data = json.loads(response.text)
heroBans = data['data']['heroStats']['banDay']

total_matches = 0

for hero in heroBans:
    total_matches += hero['matchCount']

total_matches /= 10

for hero in heroBans:
    banRate = hero['matchCount'] / total_matches
    print(hero['heroId'])
    print(banRate)

print(total_matches)