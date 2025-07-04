#!/usr/bin/env python3

from collections import Counter
from dotenv import load_dotenv

import os
import psycopg2
import json
import requests
import boto3

load_dotenv()

database_url = os.environ.get('DATABASE_URL')
graphql_token = os.environ.get('NEXT_PUBLIC_REACT_APP_TOKEN')

response = requests.get("https://dhpoqm1ofsbx7.cloudfront.net/patch.txt")
patch = response.text

url = 'https://api.stratz.com/graphql' #GraphQL Endpoint
headers = {'Authorization': f'Bearer {graphql_token}', 'User-Agent': 'STRATZ_API'}

conn = psycopg2.connect(database_url)
cur = conn.cursor() # Open a cursor to perform database operations

cur.execute("SELECT hero_id from heroes;")
hero_ids = [row[0] for row in cur.fetchall()]

rates_response = requests.get(f"https://dhpoqm1ofsbx7.cloudfront.net/data{patch}/rates.json")
rates = json.dumps(rates_response)
# [0] is hero_id, [6] is role, [7] is rank

s3 = boto3.client('s3')


ranks = ['', 'HERALD_GUARDIAN', 'CRUSADER_ARCHON', 'LEGEND_ANCIENT', 'DIVINE_IMMORTAL']
roles = ['All', 'POSITION_1', 'POSITION_2', 'POSITION_3', 'POSITION_4', 'POSITION_5']

hero_roles = {
    'POSITION_1': [],
    'POSITION_2': [],
    'POSITION_3': [],
    'POSITION_4': [],
    'POSITION_5': []
}

def getQuery():

    global ranks

    queries = []

    for rank in ranks:
        rank_query = f"""
            {rank if rank else 'All'}: heroStats {{
                    matchUp(
                        take: 125
                        {'bracketBasicIds: ' + rank if rank else ''}
                    ) {{
                        heroId
                        vs {{
                            heroId2
                            winCount
                            matchCount
                        }}
                        with {{
                            heroId2
                            winCount
                            matchCount
                        }}
                    }}
                }}
            """
        queries.append(rank_query)
            
    combined_queries = "\n".join(queries)
        
    query = f"""
        query {{
            {combined_queries}
        }}
    """
    
    return query

query = getQuery()
response = requests.post(url, headers=headers, json={'query': query}, timeout=600)
data = json.loads(response.text)


for role in roles:
    if role != 'All':
        for rate in rates:
            if role == rate[6] and rate[7] == "" and rate[9] != '?':
                hero_roles[role].append(rate[0])


for rank in ranks:

    rankName = rank if rank else 'All'

    matchupData = data['data'][rankName]['matchUp']
    
    for matchup in matchupData:

        hero_id = matchup['heroId']
        
        if hero_id in hero_ids:

            hero_matchups = []
            
            for role in roles:

                if role == "All":
                    heroes_against = hero_ids
                    heroes_with = hero_ids
                elif role == "POSITION_1":
                    heroes_against = hero_roles['POSITION_3']
                    heroes_with = hero_roles['POSITION_5']
                elif role == "POSITION_2":
                    heroes_against = hero_roles['POSITION_2']
                    heroes_with.extend(hero_roles['POSITION_1'])
                    heroes_with.extend(hero_roles['POSITION_3'])
                    heroes_with.extend(hero_roles['POSITION_4'])
                    heroes_with.extend(hero_roles['POSITION_5'])
                elif role == "POSITION_3":
                    heroes_against = hero_roles['POSITION_1']
                    heroes_with = hero_roles['POSITION_4']
                elif role == "POSITION_4":
                    heroes_against = hero_roles['POSITION_5']
                    heroes_with = hero_roles['POSITION_3']
                elif role == "POSITION_5":
                    heroes_against = hero_roles['POSITION_4']
                    heroes_with = hero_roles['POSITION_1']


                matchupsVs = matchup['vs']
                matchupsWith = matchup['with']

                vsFinal = []
                withFinal = []

                for matchup in matchupsVs:
                    if matchup['heroId2'] in heroes_against:
                        vsFinal.append({'Hero': matchup['heroId2'], 'WR': round((matchup['winCount']/matchup['matchCount'])*100,2), 'Matches': matchup['matchCount']})
                
                vsFinal.sort(key=lambda x: x['WR'], reverse=True)

                for matchup in matchupsWith:
                    if matchup['heroId2'] in heroes_with:
                        withFinal.append({'Hero': matchup['heroId2'], 'WR': round((matchup['winCount']/matchup['matchCount'])*100,2), 'Matches': matchup['matchCount']})
                
                withFinal.sort(key=lambda x: x['WR'], reverse=True)

                matchup_json = {
                    'role': role,
                    'vs': vsFinal,
                    'with': withFinal
                }

                hero_matchups.append(matchup_json)

        s3.put_object(Bucket='dotam-content', Key=f"data/{patch}/{hero_id}/matchups/{rank}/matchups.json", Body=json.dumps(hero_matchups, indent=2))
                    


        

