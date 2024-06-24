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

Boots = [29, 48, 50, 63, 180, 214, 220, 231, 931] #Brown Boots ID is 29
Support = [30, 40, 42, 43, 45, 188, 257, 286]
Consumable = [38, 39, 44, 216, 241, 265, 4204, 4205, 4026]

Early = [29, 34, 36, 41, 73, 75, 77, 88, 178, 181, 240, 244, 569]

SupportFull = [37, 79, 90, 92, 102, 226, 231, 254, 269, 1128]
FullItems = [1, 48, 50, 63, 65, 81, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114,
            116, 119, 121, 123, 125, 127, 131, 133, 135, 137, 139, 141, 143, 145, 
            147, 149, 151, 152, 154, 156, 158, 160, 162, 164, 166, 168, 170, 172, 
            174, 176, 180, 185, 190, 193, 194, 196, 201, 202, 203, 204, 206, 208, 
            210, 214, 220, 223, 225, 226, 229, 231, 232, 235, 236, 242, 247, 249, 
            250, 252, 254, 256, 259, 263, 267, 269, 271, 273, 277, 534, 596, 598, 
            600, 603, 604, 609, 610, 635, 931, 939, 1097, 1107, 1466, 1806, 1808]

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
                abilities {
                    abilityId
                    isTalent
                }
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

    for ranked_match in ranked_matches:
        match_id = ranked_match['match_id']
        gqlmatch = data['data']['match_' + str(match_id)]
        rank = actualRank(gqlmatch['actualRank'])
        players = gqlmatch['players']
        for n, player in enumerate(players):
            hero_id = ranked_match['players'][n]['id']
            position = player['position']
            facet = ranked_match['players'][n]['facet']
            gameWon = ranked_match['players'][n]['won']
            abilities = player['abilities']
            abilityBuild = []
            talents = []
            for ability in abilities:
                if ability['abilityId'] != 730:
                    abilityBuild.append(ability['abilityId'])
                    if ability['isTalent']:
                        talents.append(ability['abilityId'])
            itemPurchases = player['stats']['itemPurchases']
            startingItems = []
            earlyItems = []
            coreItems = []
            lateItems = []
            print(f"Match ID: {match_id}, Hero ID: {hero_id}, Position: {position}, Rank: {rank}, Abilities: {abilityBuild}, Talents: {talents}")
                


def actualRank(rank):
    if rank >= 80:
        return "IMMORTAL"
    elif rank >= 70:
        return "DIVINE"
    elif rank >= 60:
        return "ANCIENT"
    elif rank >= 50:
        return "LEGEND"
    elif rank >= 40:
        return "ARCHON"
    elif rank >= 30:
        return "CRUSADER"
    elif rank >= 20:
        return "GUARDIAN"
    else:
        return "HERALD"

    

def getDotaSeq(seq_num, ranked_matches):
    
    global SEQ_URL

    DOTA_2_URL = SEQ_URL + seq_num

    response = requests.get(DOTA_2_URL)
    if response.status_code == 200:
        matches = response.json()['result']['matches']
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
