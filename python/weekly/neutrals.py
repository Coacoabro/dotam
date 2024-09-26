#!/usr/bin/env python3

from collections import Counter
from dotenv import load_dotenv

import time
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
            items {
                id
                stat {
                    cost
                }
            }
        }
    }
"""

constresponse = requests.post(url, headers=headers, json={'query': constquery})
constdata = json.loads(constresponse.text)
itemsData = constdata['data']['constants']['items']
itemsData_dict = {item['id']: item for item in itemsData}

roles = ['POSITION_1', 'POSITION_2', 'POSITION_3', 'POSITION_4', 'POSITION_5']
ranks = ['', 'HERALD_GUARDIAN', 'CRUSADER_ARCHON', 'LEGEND_ANCIENT', 'DIVINE_IMMORTAL']

response = requests.get("https://dhpoqm1ofsbx7.cloudfront.net/patch.txt")
patch = response.text()

cur.execute("TRUNCATE TABLE items")

def getQuery(rank):

    global roles

    queries = []
    
    for role in roles:
        role_query = f"""
            {role}: heroStats {{
                itemNeutral(
                    heroId: {hero_id}
                    {'bracketBasicIds: ' + rank if rank else ''}
                    {'positionIds: ' + role}
                ) {{
                    itemId
                    equippedMatchCount
                    equippedMatchWinCount
                    item {{
                        stat {{
                            neutralItemTier
                        }}
                    }}
                }}
            }}
        """
        queries.append(role_query)
            
    combined_queries = "\n".join(queries)
        
    query = f"""
        query {{
            {combined_queries}
        }}
    """
    
    return query

for hero_id in hero_ids:
    
    for rank in ranks:

        query = getQuery(rank)
        response = requests.post(url, headers=headers, json={'query': query}, timeout=(600))
        data = json.loads(response.text)
            
        for role in roles:

            isSupport = False
            if role == 'POSITION_4' or role == 'POSITION_5':
                isSupport = True
            
            neutralItems = data['data'][role]['itemNeutral']
            
            if neutralItems:

                neutralItems.sort(key=lambda item: item['equippedMatchCount'], reverse=True)
                tierArray = [[] for _ in range(5)]
                tierArray[0] = [item for item in neutralItems if item['item']['stat']['neutralItemTier'] == 'TIER_1']
                tierArray[1] = [item for item in neutralItems if item['item']['stat']['neutralItemTier'] == 'TIER_2']
                tierArray[2] = [item for item in neutralItems if item['item']['stat']['neutralItemTier'] == 'TIER_3']
                tierArray[3] = [item for item in neutralItems if item['item']['stat']['neutralItemTier'] == 'TIER_4']
                tierArray[4] = [item for item in neutralItems if item['item']['stat']['neutralItemTier'] == 'TIER_5']

                neutralFinal = {}

                for i, array in enumerate(tierArray):
                    neutralFinal[f'Tier {i+1}'] = []
                    for item in array:
                        if len(neutralFinal[f'Tier {i+1}']) < 5 and item['equippedMatchCount'] > 0:
                            neutralFinal[f'Tier {i+1}'].append({'Item': item['itemId'], 'Matches': item['equippedMatchCount'], 'Wins': item['equippedMatchWinCount'], 'WR': round((item['equippedMatchWinCount']/item['equippedMatchCount'])*100, 2)})

            cur.execute("INSERT INTO items (hero_id, rank, role, neutrals) VALUES (%s, %s, %s, %s);", (hero_id, rank, role, json.dumps(neutralFinal)))

            conn.commit() # Commit the transaction

conn.close()
    
    

            



    
