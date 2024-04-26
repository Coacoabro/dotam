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
hero_ids = hero_ids[106:]
# hero_ids = hero_ids[:len(hero_ids)//3]
# hero_ids = hero_ids[len(hero_ids)//3:2*len(hero_ids)//3]
# hero_ids = hero_ids[2*len(hero_ids)//3:]
# print(hero_ids)

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

roles = ['', 'POSITION_1', 'POSITION_2', 'POSITION_3', 'POSITION_4', 'POSITION_5']
ranks = ['', 'HERALD_GUARDIAN', 'CRUSADER_ARCHON', 'LEGEND_ANCIENT', 'DIVINE_IMMORTAL']

Consumable = [38, 39, 44, 216, 241, 265, 4204, 4205, 4026]
Early = [34, 36, 73, 75, 77, 88, 178, 181, 240, 244, 569, 596]

for hero_id in hero_ids:
    for role in roles:
        for rank in ranks:
            query = f"""
                query {{
                    heroStats {{
                        itemFullPurchase(
                            {'heroId: ' + str(hero_id)}
                            {'bracketBasicIds: ' + rank if rank else ''}
                            {'positionIds: ' + role if role else ''}
                        ) {{
                            itemId
                            matchCount
                            time
                            winCount
                        }}
                        itemBootPurchase(
                            heroId: {hero_id}
                            {'bracketBasicIds: ' + rank if rank else ''}
                            {'positionIds: ' + role if role else ''}
                        ) {{
                            itemId
                            timeAverage
                            winCount
                            matchCount
                        }}
                        itemStartingPurchase(
                            heroId: {hero_id}
                            {'bracketBasicIds: ' + rank if rank else ''}
                            {'positionIds: ' + role if role else ''}
                        ) {{
                            itemId
                            winCount
                            matchCount
                            wasGiven
                        }}
                        itemNeutral(
                            heroId: {hero_id}
                            {'bracketBasicIds: ' + rank if rank else ''}
                            {'positionIds: ' + role if role else ''}
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
                }}
            """

            response = requests.post(url, headers=headers, json={'query': query}, timeout=(10, 600))
            data = json.loads(response.text)

            boots = data['data']['heroStats']['itemBootPurchase']
            startingItems = data['data']['heroStats']['itemStartingPurchase']
            neutralItems = data['data']['heroStats']['itemNeutral']
            allItems = data['data']['heroStats']['itemFullPurchase']

            maxMatches = 0 # Using brown boots. Not the best way to get all matches, but this is temporary

            
            if boots:
                boots.sort(key=lambda item: item['matchCount'], reverse=True)
                bootsEarly = []
                bootsLate = []

                for item in boots:
                    if item['itemId'] == 29:
                        maxMatches = item['matchCount']

                for item in boots:
                    pr = item['matchCount']/maxMatches
                    if pr > 0.025 and item['itemId'] != 29:
                        if item['timeAverage'] < 1200:
                            bootsEarly.append({'Item': item['itemId'], 'Matches': item['matchCount'], 'PR': round(pr*100, 2), 'WR': round((item['winCount']/item['matchCount'])*100, 2), 'Time': round((item['timeAverage'])/60, 0)})
                        if item['timeAverage'] > 1200:
                            bootsLate.append({'Item': item['itemId'], 'Matches': item['matchCount'], 'PR': round(pr*100, 2), 'WR': round((item['winCount']/item['matchCount'])*100, 2), 'Time': round((item['timeAverage'])/60, 0)})

                bootsFinal = {'Early': bootsEarly[:4], 'Late': bootsLate[:3]}

            if startingItems:
                startingGold = 600
                startingItems = [item for item in startingItems if not item.get('wasGiven', False)]
                startingItems.sort(key=lambda item: item['matchCount'], reverse=True)
                startingFinal = []

                for item in startingItems:

                    startingGold -= itemsData_dict.get(item['itemId'], {}).get('stat', {}).get('cost')
                    if startingGold > 0 and len(startingFinal) < 6:
                        startingFinal.append(item['itemId'])
                    else:
                        startingGold += itemsData_dict.get(item['itemId'], {}).get('stat', {}).get('cost')
                        startingGold -= 50
                        if startingGold > 0 and len(startingFinal) < 6:
                            startingFinal.append(16)
                        else:
                            break
            
            organizedItems = {}

            if allItems and maxMatches > 0:

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
                    avgTime = round(avgTime, 1)
                    finalItems.append({'Item' : itemId, 'Matches': totalMatches, 'Time': avgTime, 'Wins': totalWins, 'PR': 0,'WR': round((totalWins/totalMatches)*100, 2), 'Early': isEarly})

                finalItems_sorted = sorted(finalItems, key=lambda item: item['Matches'], reverse=True)

                
                for item in finalItems_sorted:
                    item['PR'] = round((item['Matches']/maxMatches)*100, 2)

                earlyItems = [itemData for itemData in finalItems_sorted if itemData['Early'] == True]
                coreItems = [itemData for itemData in finalItems_sorted if itemData['Time'] <= 30 and itemData['Early'] == False]
                lateItems = [itemData for itemData in finalItems_sorted if itemData['Time'] > 30 and itemData['Early'] == False]

                mainItems = {'Early': earlyItems, 'Core': coreItems, 'Late': lateItems}

            
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
                            neutralFinal[f'Tier {i+1}'].append({'Item': item['itemId'], 'Matches': item['equippedMatchCount'], 'Wins': item['equippedMatchWinCount'], 'PR': round((item['equippedMatchCount']/maxMatches)*100, 2), 'WR': round((item['equippedMatchWinCount']/item['equippedMatchCount'])*100, 2)})

            cur.execute("INSERT INTO items (hero_id, rank, role, starting, main, boots, neutrals) VALUES (%s, %s, %s, %s, %s, %s, %s);", (hero_id, rank, role, startingFinal, json.dumps(mainItems), json.dumps(bootsFinal), json.dumps(neutralFinal)))

            conn.commit() # Commit the transaction

conn.close()
    
    

            



    
