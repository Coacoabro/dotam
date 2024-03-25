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

data = {}

for hero_id in hero_ids:

    itemBuilds = [[]]
    startingItems = [[]]
    bootsProgression = [[]]

    queryGuides = f"""
        query{{
            heroStats {{
            guide(
                {'heroId: ' + str(hero_id)}
            ) {{
                guides(take: 10) {{
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

        startingItems.append([])
        for event in purchaseEvents:
            if event['time'] < 0:
                startingItems[i].append(event['itemId'])


        itemBuilds.append([])
        bootsProgression.append([])

        for event in purchaseEvents:
            if event['itemId'] not in itemBuilds[i]:
                if event['itemId'] in Boots and len(itemBuilds[i]) < 6:
                    bootsProgression[i].append(event['itemId'])
                    if event['itemId'] != 29:
                        itemBuilds[i].append((event['itemId']))
                elif event['itemId'] in finishedItems and len(itemBuilds[i]) < 6 and event['time'] > 0:
                    itemBuilds[i].append((event['itemId']))

        i += 1

    data[hero_id] = {'itemBuilds': itemBuilds, 'startingItems': startingItems, 'bootsProgression': bootsProgression}

    firstItems = []
    secondItems = []
    thirdItems = []
    fourthItems = []
    fifthItems = []
    sixthItems = []


    for itemBuild in itemBuilds:
        try:
            firstItems.append(itemBuild[0])
        except IndexError:
            pass
        try:
            secondItems.append(itemBuild[1])
        except IndexError:
            pass
        try:
            thirdItems.append(itemBuild[2])
        except IndexError:
            pass
        try:
            fourthItems.append(itemBuild[3])
        except IndexError:
            pass
        try:
            fifthItems.append(itemBuild[4])
        except IndexError:
            pass
        try:
            sixthItems.append(itemBuild[5])
        except IndexError:
            pass

    # Make sure to have the list check the highest percentage of the before items and not take them into account for the next items

    commonFirst = most_common_items(firstItems)
    commonSecond = most_common_items(secondItems)
    commonThird = most_common_items(thirdItems)
    commonFourth = most_common_items(fourthItems)
    commonFifth = most_common_items(fifthItems)
    commonSixth = most_common_items(sixthItems)

    finalItems = json.dumps({
        'First': commonFirst,
        'Second': commonSecond,
        'Third': commonThird,
        'Fourth': commonFourth,
        'Fifth': commonFifth,
        'Sixth': commonSixth
    })

    cur.execute("INSERT INTO builds (hero_id, items) VALUES (%s, %s);", (hero_id, finalItems))
        

conn.commit() # Commit the transaction

conn.close() # Close communication with the database
