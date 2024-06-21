#!/usr/bin/env python3

from collections import Counter
from dotenv import load_dotenv

import os
import psycopg2
import json
import requests

def get_hero_abilities():
    load_dotenv()

    database_url = os.environ.get('DATABASE_URL')
    graphql_token = os.environ.get('NEXT_PUBLIC_REACT_APP_TOKEN')

    url = 'https://api.stratz.com/graphql' #GraphQL Endpoint
    headers = {'Authorization': f'Bearer {graphql_token}'}

    conn = psycopg2.connect(database_url)
    cur = conn.cursor() # Open a cursor to perform database operations

    cur.execute("SELECT hero_id from heroes;")
    hero_ids = [row[0] for row in cur.fetchall()]

    hero_abilities = {}

    for heroID in hero_ids:
        query = f"""
            query {{
                heroStats {{
                    guide({'heroId: ' + str(heroID)}, take: 1) {{
                        guides {{
                            match {{
                                players {{
                                    heroId
                                    playbackData {{
                                        abilityLearnEvents {{
                                            abilityId
                                            isUltimate
                                            isTalent
                                            levelObtained
                                        }}
                                    }}
                                }}
                            }}
                        }}
                    }}
                }}
            }}
        """

        response = requests.post(url, headers=headers, json={'query': query})
        data = json.loads(response.text)
        match = data['data']['heroStats']['guide'][0]['guides'][0]['match']['players']

        for hero in match:
            if hero['heroId'] == heroID:
                abilities = hero['playbackData']['abilityLearnEvents']
                break
        
        basicabilities = []
        ultimateability = 0

        for ability in abilities:
            if not ability['isTalent']:
                if ability['isUltimate']:
                    ultimateability = ability['abilityId']
                else:
                    if ability['abilityId'] not in basicabilities and len(basicabilities) < 3:
                        basicabilities.append(ability['abilityId'])
        
        finalAbilities = basicabilities + [ultimateability]

        hero_abilities[heroID] = finalAbilities
    with open('./src/json/hero_abilities.json', 'w') as f:
        json.dump(hero_abilities, f)

get_hero_abilities()







    