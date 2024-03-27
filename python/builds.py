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

def most_common_items(item_list):
    counter = Counter(item_list)
    three_most_common = counter.most_common(3)
    total_items = len(item_list)
    items = []
    for item, count in three_most_common:
        percentage = round((count / total_items) * 100, 2)
        items.append({'Item': item, 'Percentage': percentage})
    
    return items
        


url = 'https://api.stratz.com/graphql' #GraphQL Endpoint
headers = {'Authorization': f'Bearer {graphql_token}'}

conn = psycopg2.connect(database_url)
cur = conn.cursor() # Open a cursor to perform database operations

cur.execute("SELECT hero_id from heroes;")
hero_ids = [row[0] for row in cur.fetchall()]

Boots = [29, 48, 50, 63, 180, 214, 220, 231, 931] #Brown Boots ID is 29
Support = [30, 40, 42, 43, 45, 188, 257, 286]
Consumable = [38, 39, 44, 216, 241, 4204, 4205, 4026]
Early = [36, 73, 75, 77, 178, 569, 596]

data = {}

first_half = hero_ids[:len(hero_ids)//2]
second_half = hero_ids[len(hero_ids)//2:]

take = 100

#for hero_id in second_half:
hero_id = 4

itemBuilds = [[]]
lateItems = [[]]
startingItems = [[]]
extraItems = [[]]
bootsProgression = [[]]
abilityOrder = [[]]

queryGuides = f"""
    query{{
        heroStats {{
        guide(
            {'heroId: ' + str(hero_id)}
        ) {{
            guides({'take: ' + str(take)}) {{
                matchId
                steamAccountId
            }}
        }}
        }}
    }}
    """
responseGuides = requests.post(url, json={'query': queryGuides}, headers=headers)
dataGuides = json.loads(responseGuides.text)

i = 0

for guide in dataGuides['data']['heroStats']['guide'][0]['guides']:
    queryGuide = f"""
        query{{
            match(id: {guide['matchId']}) {{
                players(steamAccountId: {guide['steamAccountId']}) {{
                    item0Id
                    item1Id
                    item2Id
                    item3Id
                    item4Id
                    item5Id
                    backpack0Id
                    backpack1Id
                    backpack2Id
                    playbackData {{
                        purchaseEvents {{
                            itemId
                            time
                        }}
                        abilityLearnEvents {{
                            abilityId
                            levelObtained
                        }}
                    }}
                }}
            }}
        }}
        """
    responseGuide = requests.post(url, json={'query': queryGuide}, headers=headers, timeout=600)
    dataGuide = json.loads(responseGuide.text)

    finishedItems = [dataGuide['data']['match']['players'][0]['item0Id'], 
                        dataGuide['data']['match']['players'][0]['item1Id'], 
                        dataGuide['data']['match']['players'][0]['item2Id'], 
                        dataGuide['data']['match']['players'][0]['item3Id'], 
                        dataGuide['data']['match']['players'][0]['item4Id'], 
                        dataGuide['data']['match']['players'][0]['item5Id'],
                        dataGuide['data']['match']['players'][0]['backpack0Id'],
                        dataGuide['data']['match']['players'][0]['backpack1Id'],
                        dataGuide['data']['match']['players'][0]['backpack2Id']
                    ]
    
    purchaseEvents = dataGuide['data']['match']['players'][0]['playbackData']['purchaseEvents']
    abilityEvents = dataGuide['data']['match']['players'][0]['playbackData']['abilityLearnEvents']

    startingItems.append([])
    for event in purchaseEvents:
        if event['time'] < 0:
            startingItems[i].append(event['itemId'])


    itemBuilds.append([])
    extraItems.append([])
    bootsProgression.append([])

    for event in purchaseEvents:
        if event['itemId'] and event['itemId'] not in itemBuilds[i] and event['itemId'] not in startingItems[i]:
            if len(itemBuilds[i]) < 3:
                if event['itemId'] in Support or event['itemId'] in Consumable or event['itemId'] in Early:
                    extraItems.append((event['itemId']))
                else:
                    if event['itemId'] in Boots:
                        bootsProgression[i].append(event['itemId'])
                        if event['itemId'] != 29:
                            itemBuilds[i].append((event['itemId']))
                    elif event['itemId'] in finishedItems and event['time'] > 0:
                        itemBuilds[i].append((event['itemId']))
            else:
                if event['itemId'] not in Support and event['itemId'] not in Consumable:
                    if event['itemId'] in Boots:
                        bootsProgression[i].append(event['itemId'])
                        if event['itemId'] != 29:
                            lateItems.append((event['itemId']))
                    elif event['itemId'] in finishedItems and event['time'] > 0:
                        lateItems.append((event['itemId'])) 

    abilityOrder.append([])
    for event in abilityEvents:
        if event['levelObtained'] < 17:
            abilityOrder[i].append(event['abilityId'])

    i += 1


commonBuild = Counter(map(tuple, itemBuilds)).most_common(3)
commonStarting = Counter(map(tuple, startingItems)).most_common(1)
commonExtra = Counter(list(filter(bool, extraItems))).most_common(6)
commonLate = Counter(list(filter(bool, lateItems))).most_common(8)

abilitiesCount = Counter(map(tuple, abilityOrder)).most_common(1)
commonAbilityBuild, abilityCount = abilitiesCount[0]

firstBuild, firstCount = commonBuild[0]
secondBuild, secondCount = commonBuild[1]
thirdBuild, thirdCount = commonBuild[2]

commonStartingItems, startingCount = commonStarting[0]

mostCommonExtras = []
for i, (item, count) in enumerate(commonExtra, start=1):
    percentage = (count / take) * 100
    if percentage > 10:
        most_common_dict = {
            'Item': item, 'Percentage': f"{percentage:.2f}%"
        }
        mostCommonExtras.append(most_common_dict)

mostCommonLate = []
for i, (item, count) in enumerate(commonLate, start=1):
    percentage = (count / take) * 100
    if percentage > 10:
        most_common_dict = {
            'Item': item, 'Percentage': f"{percentage:.2f}%"
        }
        mostCommonLate.append(most_common_dict)


finalItems = json.dumps({
    'First': {'Build': firstBuild, 'Percentage': f"{(firstCount*100)/take:.2f}%"},
    'Second': {'Build': secondBuild, 'Percentage': f"{(secondCount*100)/take:.2f}%"},
    'Third': {'Build': thirdBuild, 'Percentage': f"{(thirdCount*100)/take:.2f}%"},
    'Starting': commonStartingItems,
    'Extra': mostCommonExtras,
    'Late': mostCommonLate
})

cur.execute("INSERT INTO builds (hero_id, items, abilities) VALUES (%s, %s, %s);", (hero_id, finalItems, list(commonAbilityBuild)))
        

conn.commit() # Commit the transaction

conn.close() # Close communication with the database
