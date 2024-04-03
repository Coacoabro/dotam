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

constquery = """
    query {
        constants {
            abilities {
                id
                isTalent
                stat {
                    isUltimate
                }
            }
        }
    }
"""

abilities = []
constresponse = requests.post(url, headers=headers, json={'query': constquery})
constdata = json.loads(constresponse.text)
abilityData = constdata['data']['constants']['abilities']

for ability in abilityData:
         if ability['isTalent'] is not None and ability['stat'] is not None:
            if ability['isTalent'] == False and ability['stat']['isUltimate'] == False:
                abilities.append(ability['id'])

for hero_id in hero_ids:
    query = f"""
        query {{
            heroStats {{
                abilityMaxLevel(heroId: {hero_id}) {{
                    abilityId
                    level
                    winCount
                    matchCount
                }}
                abilityMinLevel(heroId: {hero_id}) {{
                    abilityId
                    level
                    winCount
                    matchCount
                }}
            }}
        }}
    """

    response = requests.post(url, headers=headers, json={'query': query})
    data = json.loads(response.text)

    abilityMaxLevel = data['data']['heroStats']['abilityMaxLevel']
    abilityMinLevel = data['data']['heroStats']['abilityMinLevel']

    ability1 = 0
    ability2 = 0
    ability3 = 0

    min1 = []
    min2 = []
    min3 = []

    max1 = []
    max2 = []
    max3 = []

    totalMatches = 0


    for ability in abilityMinLevel:
        if ability['abilityId'] in abilities:
            if ability['abilityId'] != ability1 and ability1 == 0:
                ability1 = ability['abilityId']
            elif ability['abilityId'] != ability2 and ability2 == 0 and ability['abilityId'] != ability1:
                ability2 = ability['abilityId']
            elif ability['abilityId'] != ability3 and ability3 == 0 and ability['abilityId'] != ability1 and ability['abilityId'] != ability2:
                ability3 = ability['abilityId']
            else:
                continue

            if ability['abilityId'] == ability1:
                totalMatches += ability['matchCount']



    for ability in abilityMaxLevel:
        if (ability['matchCount']/totalMatches) > 0.25:
            if ability['abilityId'] == ability1:
                min1.append({'level': ability['level'], 'winCount': ability['winCount'], 'matchCount': ability['matchCount'], 'winRate': ability['winCount']/ability['matchCount']*100})
            elif ability['abilityId'] == ability2:
                min2.append({'level': ability['level'], 'winCount': ability['winCount'], 'matchCount': ability['matchCount'], 'winRate': ability['winCount']/ability['matchCount']*100})
            elif ability['abilityId'] == ability3:
                min3.append({'level': ability['level'], 'winCount': ability['winCount'], 'matchCount': ability['matchCount'], 'winRate': ability['winCount']/ability['matchCount']*100})


    for ability in abilityMinLevel:
        if (ability['matchCount']/totalMatches) > 0.25:
            if ability['abilityId'] == ability1:
                max1.append({'level': ability['level'], 'winCount': ability['winCount'], 'matchCount': ability['matchCount'], 'winRate': ability['winCount']/ability['matchCount']*100})
            elif ability['abilityId'] == ability2:
                max2.append({'level': ability['level'], 'winCount': ability['winCount'], 'matchCount': ability['matchCount'], 'winRate': ability['winCount']/ability['matchCount']*100})
            elif ability['abilityId'] == ability3:
                max3.append({'level': ability['level'], 'winCount': ability['winCount'], 'matchCount': ability['matchCount'], 'winRate': ability['winCount']/ability['matchCount']*100})

    print(f"Hero: {hero_id}")
    print(f"Total Matches: {totalMatches}")
    print(f"Min Level Ability 1: {min1}")
    print(f"Min Level Ability 2: {min2}")
    print(f"Min Level Ability 3: {min3}")
    print(f"Max Level Ability 1: {max1}")
    print(f"Max Level Ability 2: {max2}")
    print(f"Max Level Ability 3: {max3}")