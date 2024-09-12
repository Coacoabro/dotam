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

cur.execute("TRUNCATE TABLE matchups")

cur.execute("SELECT hero_id from heroes;")
hero_ids = [row[0] for row in cur.fetchall()]

cur.execute("SELECT * from rates")
rates = cur.fetchall()
# [0] is hero_id, [6] is role, [7] is rank


ranks = ['', 'HERALD_GUARDIAN', 'CRUSADER_ARCHON', 'LEGEND_ANCIENT', 'DIVINE_IMMORTAL']
roles = ['POSITION_1', 'POSITION_2', 'POSITION_3', 'POSITION_4', 'POSITION_5']

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

for rank in ranks:

    rankName = rank if rank else 'All'

    matchupData = data['data'][rankName]['matchUp']

    for role in roles:

        heroesByRR = []

        for rate in rates:
            if role == rate[6] and rate[7] in rank and rate[9] != '?':
                heroesByRR.append(rate[0])

        for matchup in matchupData:

            hero_id = matchup['heroId']            

            if hero_id in heroesByRR:
        
                matchupsVs = matchup['vs']
                matchupsWith = matchup['with']

                vsFinal = []
                withFinal = []

                for matchup in matchupsVs:
                    if matchup['heroId2'] in heroesByRR:
                        vsFinal.append({'Hero': matchup['heroId2'], 'WR': round((matchup['winCount']/matchup['matchCount'])*100,2), 'Matches': matchup['matchCount']})
                
                vsFinal.sort(key=lambda x: x['WR'], reverse=True)

                for matchup in matchupsWith:
                    withFinal.append({'Hero': matchup['heroId2'], 'WR': round((matchup['winCount']/matchup['matchCount'])*100,2), 'Matches': matchup['matchCount']})
                
                withFinal.sort(key=lambda x: x['WR'], reverse=True)

                cur.execute("INSERT INTO matchups (hero_id, rank, role, herovs, herowith) VALUES (%s, %s, %s, %s, %s);", (hero_id, rank, role, json.dumps(vsFinal), json.dumps(withFinal)))

                conn.commit() # Commit the transaction

conn.close()

        

