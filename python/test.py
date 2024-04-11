#!/usr/bin/env python3

from collections import Counter
from dotenv import load_dotenv

import os
import psycopg2
import json
import requests

with open('./dotaconstants/build/item_ids.json') as f:
    item_ids_json = json.load(f)

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

Consumable = [38, 39, 44, 216, 241, 265, 4204, 4205, 4026]
Early = [34, 36, 73, 75, 77, 178, 244, 569, 596]

hero_id = 17

# for hero_id in hero_ids:
query = f"""
    query{{
        heroStats {{
            itemFullPurchase(
                {'heroId: ' + str(hero_id)}
            ) {{
                itemId
                matchCount
                time
                winCount
            }}
        }}
    }}
"""

response = requests.post(url, headers=headers, json={'query': query})
data = json.loads(response.text)

allItems = data['data']['heroStats']['itemFullPurchase']

organizedItems = {}

for item in allItems:
    itemId = item['itemId']
    if itemId not in Consumable:
        if itemId not in organizedItems:
            organizedItems[itemId] = [{'Matches': item['matchCount'], 'Time': item['time'], 'Wins': item['winCount']}]
        else:
            organizedItems[itemId].append({'Matches': item['matchCount'], 'Time': item['time'], 'Wins': item['winCount']})

finalItems = []
    
for itemId, itemsList in organizedItems.items():
    if itemId in Early:
        isEarly = True
    else:
        isEarly = False
    totalMatches = 0
    totalWins = 0
    avgTime = 0
    count = 0
    for obj in itemsList:
        totalMatches += obj['Matches']
        totalWins += obj['Wins']
        avgTime += obj['Time']
        count += 1
    avgTime /= count
    avgTime = round(avgTime, 2)
    finalItems.append({'Item' : itemId, 'Matches': totalMatches, 'Time': avgTime, 'Wins': totalWins, 'WR': round((totalWins/totalMatches)*100, 2), 'Early': isEarly})

finalItems_sorted = sorted(finalItems, key=lambda item: item['Matches'], reverse=True)
filteredItemsList = [itemData for itemData in finalItems_sorted if itemData['Early'] == False]
# itemData['Time'] >= 30 and 

print(hero_id)
for item in filteredItemsList:
    print(item)
    


    
    
    

#     cur.execute("INSERT INTO matchups (hero_id, rank, herovs, herowith) VALUES (%s, %s, %s, %s);", (hero_id, rank, json.dumps(vsFinal), json.dumps(withFinal)))

#     conn.commit() # Commit the transaction

# conn.close()

        

