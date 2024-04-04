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


    for ability in abilityMaxLevel:
        if ability['abilityId'] in abilities and ability['matchCount'] > 100:
            if ability['abilityId'] != ability1 and ability1 == 0:
                ability1 = ability['abilityId']
            elif ability['abilityId'] != ability2 and ability2 == 0 and ability['abilityId'] != ability1:
                ability2 = ability['abilityId']
            elif ability['abilityId'] != ability3 and ability3 == 0 and ability['abilityId'] != ability1 and ability['abilityId'] != ability2:
                ability3 = ability['abilityId']
            else:
                continue




    for ability in abilityMaxLevel:
        if ability['abilityId'] == ability1:
            max1.append({'ability': ability['abilityId'], 'level': ability['level'], 'winCount': ability['winCount'], 'matchCount': ability['matchCount'], 'winRate': round(ability['winCount']/ability['matchCount']*100, 2)})
        elif ability['abilityId'] == ability2:
            max2.append({'ability': ability['abilityId'], 'level': ability['level'], 'winCount': ability['winCount'], 'matchCount': ability['matchCount'], 'winRate': round(ability['winCount']/ability['matchCount']*100, 2)})
        elif ability['abilityId'] == ability3:
            max3.append({'ability': ability['abilityId'], 'level': ability['level'], 'winCount': ability['winCount'], 'matchCount': ability['matchCount'], 'winRate': round(ability['winCount']/ability['matchCount']*100, 2)})


    for ability in abilityMinLevel:
        if ability['abilityId'] == ability1:
            min1.append({'ability': ability['abilityId'], 'level': ability['level'], 'winCount': ability['winCount'], 'matchCount': ability['matchCount'], 'winRate': round(ability['winCount']/ability['matchCount']*100, 2)})
        elif ability['abilityId'] == ability2:
            min2.append({'ability': ability['abilityId'], 'level': ability['level'], 'winCount': ability['winCount'], 'matchCount': ability['matchCount'], 'winRate': round(ability['winCount']/ability['matchCount']*100, 2)})
        elif ability['abilityId'] == ability3:
            min3.append({'ability': ability['abilityId'], 'level': ability['level'], 'winCount': ability['winCount'], 'matchCount': ability['matchCount'], 'winRate': round(ability['winCount']/ability['matchCount']*100, 2)})

    min1.sort(key=lambda x: x['matchCount'], reverse=True)
    min2.sort(key=lambda x: x['matchCount'], reverse=True)
    min3.sort(key=lambda x: x['matchCount'], reverse=True)
    max1.sort(key=lambda x: x['matchCount'], reverse=True)
    max2.sort(key=lambda x: x['matchCount'], reverse=True)
    max3.sort(key=lambda x: x['matchCount'], reverse=True)

    min1 = json.dumps(min1[:2])
    min2 = json.dumps(min2[:2])
    min3 = json.dumps(min3[:2])
    max1 = json.dumps(max1[:2])
    max2 = json.dumps(max2[:2])
    max3 = json.dumps(max3[:2])

    cur.execute("INSERT INTO abilities (hero_id, min1, min2, min3, max1, max2, max3) VALUES (%s, %s, %s, %s, %s, %s, %s);", (hero_id, min1, min2, min3, max1, max2, max3))

    conn.commit() # Commit the transaction

conn.close() # Close communication with the database

    

    