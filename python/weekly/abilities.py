#!/usr/bin/env python3

from collections import Counter
from dotenv import load_dotenv

import os
import psycopg2
import json
import requests

with open('./dotaconstants/build/ability_ids.json') as f:
    ability_ids_json = json.load(f)

with open('./dotaconstants/build/abilities.json') as f:
    abilities_json = json.load(f)


load_dotenv()

database_url = os.environ.get('DATABASE_URL')
graphql_token = os.environ.get('NEXT_PUBLIC_REACT_APP_TOKEN')

url = 'https://api.stratz.com/graphql' #GraphQL Endpoint
headers = {'Authorization': f'Bearer {graphql_token}'}

conn = psycopg2.connect(database_url)
cur = conn.cursor() # Open a cursor to perform database operations

cur.execute("SELECT hero_id from heroes;")
hero_ids = [row[0] for row in cur.fetchall()]
# hero_ids = hero_ids[:len(hero_ids)//3]
# hero_ids = hero_ids[len(hero_ids)//3:2*len(hero_ids)//3]
# hero_ids = hero_ids[2*len(hero_ids)//3:]


constquery = """
    query {
        constants {
            abilities {
                id
                name
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
        abilityName = ability_ids_json[str(ability['id'])]
        if ability['isTalent'] == False and ability['stat']['isUltimate'] == False and abilityName != 'default_attack' and abilityName != 'attribute_bonus':
            if 'Hidden' not in abilities_json[abilityName]['behavior']:
                abilities.append(ability['id'])

roles = ['', 'POSITION_1', 'POSITION_2', 'POSITION_3', 'POSITION_4', 'POSITION_5']

for hero_id in hero_ids:
    for role in roles:
        query = f"""
            query {{
                heroStats {{
                    abilityMaxLevel(
                        heroId: {hero_id}
                        {'positionIds: ' + role if role else ''}
                    ) {{
                        abilityId
                        level
                        winCount
                        matchCount
                    }}
                    abilityMinLevel(
                        heroId: {hero_id}
                        {'positionIds: ' + role if role else ''}
                    ) {{
                        abilityId
                        level
                        winCount
                        matchCount
                    }}
                    talent(
                        heroId: {hero_id}
                        {'positionIds: ' + role if role else ''}
                    ) {{
                        abilityId
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

        for ability in abilityMinLevel:
            if ability['abilityId'] in abilities and ability['matchCount'] > 100:

                if ability['abilityId'] != ability1 and ability1 == 0:
                    ability1 = ability['abilityId']
                elif ability['abilityId'] != ability2 and ability2 == 0 and ability['abilityId'] != ability1:
                    ability2 = ability['abilityId']
                elif ability['abilityId'] != ability3 and ability3 == 0 and ability['abilityId'] != ability1 and ability['abilityId'] != ability2:
                    ability3 = ability['abilityId']
                else:
                    continue

        talents = data['data']['heroStats']['talent']
        
        if data['data']['heroStats']['abilityMaxLevel'] and data['data']['heroStats']['abilityMinLevel']:

            min1 = []
            min2 = []
            min3 = []

            max1 = []
            max2 = []
            max3 = []

            finalTalents = []*8

            
            
            

            for ability in abilityMaxLevel:
                if ability['abilityId'] == ability1:
                    max1.append({'ability': ability['abilityId'], 'level': ability['level'], 'matchCount': ability['matchCount']})
                elif ability['abilityId'] == ability2:
                    max2.append({'ability': ability['abilityId'], 'level': ability['level'], 'matchCount': ability['matchCount']})
                elif ability['abilityId'] == ability3:
                    max3.append({'ability': ability['abilityId'], 'level': ability['level'], 'matchCount': ability['matchCount']})


            for ability in abilityMinLevel:
                if ability['abilityId'] == ability1:
                    min1.append({'ability': ability['abilityId'], 'level': ability['level'], 'matchCount': ability['matchCount']})
                elif ability['abilityId'] == ability2:
                    min2.append({'ability': ability['abilityId'], 'level': ability['level'], 'matchCount': ability['matchCount']})
                elif ability['abilityId'] == ability3:
                    min3.append({'ability': ability['abilityId'], 'level': ability['level'], 'matchCount': ability['matchCount']})

            min1.sort(key=lambda x: x['matchCount'], reverse=True)
            min2.sort(key=lambda x: x['matchCount'], reverse=True)
            min3.sort(key=lambda x: x['matchCount'], reverse=True)
            max1.sort(key=lambda x: x['matchCount'], reverse=True)
            max2.sort(key=lambda x: x['matchCount'], reverse=True)
            max3.sort(key=lambda x: x['matchCount'], reverse=True)

            minAbilities = [min1[:2], min2[:2], min3[:2]]
            maxAbilities = [max1[:2], max2[:2], max3[:2]]

            maxMatchCount = 0
            for abilityArray in minAbilities:
                for abil in abilityArray:
                    if abil['matchCount'] > maxMatchCount:
                        maxMatchCount = abil['matchCount']
                        min1stMost = {'Level': abil['level'], 'Ability': abil['ability']}
            maxMatchCount = 0
            for abilityArray in minAbilities:
                for abil in abilityArray:
                    if abil['matchCount'] > maxMatchCount and abil['ability'] != min1stMost['Ability']:
                        maxMatchCount = abil['matchCount']
                        min2ndMost = {'Level': abil['level'], 'Ability': abil['ability']}
            maxMatchCount = 0
            for abilityArray in minAbilities:
                for abil in abilityArray:
                    if abil['matchCount'] > maxMatchCount and abil['ability'] != min1stMost['Ability'] and abil['ability'] != min2ndMost['Ability'] and abil['level'] != min2ndMost['Level']:
                        maxMatchCount = abil['matchCount']
                        min3rdMost = {'Level': abil['level'], 'Ability': abil['ability']}
            maxMatchCount = 0
            for abilityArray in maxAbilities:
                for abil in abilityArray:
                    if abil['matchCount'] > maxMatchCount:
                        maxMatchCount = abil['matchCount']
                        max1stMost = {'Level': abil['level'], 'Ability': abil['ability']}
            maxMatchCount = 0
            for abilityArray in maxAbilities:
                for abil in abilityArray:
                    if abil['matchCount'] > maxMatchCount and abil['ability'] != max1stMost['Ability']:
                        maxMatchCount = abil['matchCount']
                        max2ndMost = {'Level': abil['level'], 'Ability': abil['ability']}
            maxMatchCount = 0
            for abilityArray in maxAbilities:
                for abil in abilityArray:
                    if abil['matchCount'] > maxMatchCount and abil['ability'] != max1stMost['Ability'] and abil['ability'] != max2ndMost['Ability'] and abil['level'] != max2ndMost['Level']:
                        maxMatchCount = abil['matchCount']
                        max3rdMost = {'Level': abil['level'], 'Ability': abil['ability']}
            
            firstLevels = [min1stMost, min2ndMost, min3rdMost]
            firstLevels.sort(key=lambda x: x['Level'], reverse=False)
            finalLevels = [max1stMost, max2ndMost, max3rdMost]
            finalLevels.sort(key=lambda x: x['Level'], reverse=False)
            
            abilityBuild = [None]*16

            isInvoker = False

            if hero_id == 74:
                isInvoker = True

            # Level 1
            abilityBuild[0] = firstLevels[0]['Ability']
            # Level 2
            abilityBuild[1] = firstLevels[1]['Ability']
            # Level 3
            if firstLevels[2]['Level'] != 3:
                if finalLevels[0]['Level'] == 7:
                    abilityBuild[2] = finalLevels[0]['Ability']
                elif finalLevels[0]['Level'] != 7:
                    abilityBuild[2] = finalLevels[1]['Ability']
            else: abilityBuild[2] = firstLevels[2]['Ability']
            # Level 4
            if abilityBuild[2] == firstLevels[2]['Ability']:
                if finalLevels[0]['Level'] == 7:
                    abilityBuild[3] = finalLevels[0]['Ability']
                elif finalLevels[0]['Level'] != 7:
                    abilityBuild[3] = finalLevels[1]['Ability']
            else: abilityBuild[3] = firstLevels[2]['Ability']
            # Level 5
            abilityBuild[4] = finalLevels[0]['Ability']
            # Level 6 (Ultimate)
            if isInvoker:
                abilityBuild[5] = finalLevels[1]['Ability']
            else:
                abilityBuild[5] = -1
            # Level 7
            abilityBuild[6] = finalLevels[0]['Ability']
            # Level 8
            if isInvoker:
                abilityBuild[7] = finalLevels[1]['Ability']
            else:
                if finalLevels[0]['Level'] != 7:
                    abilityBuild[7] = finalLevels[0]['Ability']
                else: abilityBuild[7] = finalLevels[1]['Ability']
            # Level 9
            if isInvoker:
                abilityBuild[8] = finalLevels[0]['Ability']
            else:
                abilityBuild[8] = finalLevels[1]['Ability']
            # Level 10 (Talent)
            abilityBuild[9] = 0
            # Level 11
            if isInvoker:
                abilityBuild[10] = finalLevels[0]['Ability']
            else:
                abilityBuild[10] = finalLevels[1]['Ability']
            # Level 12 (Ultimate)
            if isInvoker:
                abilityBuild[11] = finalLevels[1]['Ability']
            else:
                abilityBuild[11] = -1
            # Level 13
            if isInvoker:
                abilityBuild[12] = finalLevels[0]['Ability']
            else:
                abilityBuild[12] = finalLevels[2]['Ability']
            # Level 14
            if isInvoker:
                abilityBuild[13] = finalLevels[1]['Ability']
            else:
                abilityBuild[13] = finalLevels[2]['Ability']
            # Level 15 (Talent)
            abilityBuild[14] = 0
            # Level 16
            if isInvoker:
                abilityBuild[15] = finalLevels[1]['Ability']
            else:
                abilityBuild[15] = finalLevels[2]['Ability']            

            for talent in talents:
                if talent['abilityId'] != 730:
                    ability_id = str(talent['abilityId'])
                    abilityName = ability_ids_json[ability_id]
                    finalTalents.append({'Ability': abilityName, 'Matches': talent['matchCount'], 'Wins': talent['winCount'], 'WinRate': round(talent['winCount']/talent['matchCount']*100, 2)})

            finalTalents = json.dumps(finalTalents)

            cur.execute("INSERT INTO abilities (hero_id, role, build, talents) VALUES (%s, %s, %s, %s);", (hero_id, role, abilityBuild, finalTalents))

            conn.commit() # Commit the transaction

conn.close() # Close communication with the database

    

    