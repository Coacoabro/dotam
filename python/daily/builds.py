#!/usr/bin/env python3

import time
import psycopg2
import json
import requests
import os

from dotenv import load_dotenv

load_dotenv()

# Steam's Web API
API_KEY = os.environ.get('DOTA_API_KEY')
SEQ_URL = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistoryBySequenceNum/v1/?key=' + API_KEY + '&start_at_match_seq_num='

def getGQLquery(ranked_matches):
    # Stratz API
    graphql_token = os.environ.get('NEXT_PUBLIC_REACT_APP_TOKEN')
    stratz_url = 'https://api.stratz.com/graphql' #GraphQL Endpoint
    stratz_headers = {'Authorization': f'Bearer {graphql_token}'}

    # My Amazon Database
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor() # Open a cursor to perform database operations

    fragment = """
        fragment MatchData on MatchType {
            actualRank
            players {
                position
                stats {
                    itemPurchases {
                        itemId
                        time
                    }
                }
            }
        }
    """

    matches_query = "\n".join([f"{'match_' + str(ranked_match['match_id'])}: match(id: {ranked_match['match_id']}) {{ ...MatchData }}" for ranked_match in ranked_matches])

    query = f"""
        query MyQuery {{
            {matches_query}
        }}
        {fragment}
    """

    response = requests.post(stratz_url, json={'query': query}, headers=stratz_headers, timeout=600)
    data = json.loads(response.text)

    for i in range(25):
        match_id = ranked_matches[i]['match_id']
        gqlmatch = data['data']['match_' + str(match_id)]
        print(gqlmatch)


    

def getDotaSeq(seq_num, ranked_matches):
    
    global SEQ_URL

    DOTA_2_URL = SEQ_URL + seq_num

    response = requests.get(DOTA_2_URL)
    if response.status_code == 200:
        matches = response.json()['result']['matches']
        seq_num = 0
        for match in matches:
            seq_num = match['match_seq_num']
            if match['lobby_type'] == 7 and match['game_mode'] == 22:
                ranked_match = {}
                radiantWon = match['radiant_win']
                ranked_match['match_id'] = match['match_id']
                players = match['players']
                i = 0
                playersInfo = []
                for player in players:
                    won = 0
                    if i < 5 and radiantWon:
                        won = 1
                    elif i > 4 and not radiantWon:
                        won = 1
                    i += 1
                    heroObj = {}
                    heroObj['id'] = player['hero_id']
                    heroObj['facet'] = player['hero_variant']
                    heroObj['won'] = won
                    playersInfo.append(heroObj)
                ranked_match['players'] = playersInfo
                ranked_matches.append(ranked_match)
                if len(ranked_matches) == 25:
                    getGQLquery(ranked_matches)
        

                    


seq_num_start = '6572003877'
ranked_matches = []
getDotaSeq(seq_num_start, ranked_matches)




# matches = [] 

# matchesdata = getGQLquery(matches)

# print(matchesdata)
