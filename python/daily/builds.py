#!/usr/bin/env python3

import time
import psycopg2
import json
import requests
import os

from dotenv import load_dotenv

load_dotenv()

# My Amazon Database
# database_url = os.environ.get('DATABASE_URL')
# conn = psycopg2.connect(database_url)
# cur = conn.cursor() # Open a cursor to perform database operations

# Stratz API
graphql_token = os.environ.get('NEXT_PUBLIC_REACT_APP_TOKEN')
stratz_url = 'https://api.stratz.com/graphql' #GraphQL Endpoint
stratz_headers = {'Authorization': f'Bearer {graphql_token}'}

# OpenDota's API
PUBLIC_MATCHES_URL = 'https://api.opendota.com/api/publicMatches'

# Steam's Web API
API_KEY = os.environ.get('DOTA_API_KEY')
SEQ_URL = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistoryBySequenceNum/v1/?start_at_match_seq_num='

def getGQLquery(matches):
    fragment = """
        fragment MatchData on MatchType {
            actualRank
            endDateTime
            players {
                heroId
                position
                variant
                abilities {
                    abilityId
                    time
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

    matches_query = "\n".join([f" match{i+1}: match(id: {match_id}) {{ ...MatchData }}" for i, match_id in enumerate(matches)])

    query = f"""
        query MyQuery {{
            {matches_query}
        }}
        {fragment}
    """

    response = requests.post(stratz_url, json={'query': query}, headers=stratz_headers, timeout=600)
    data = json.loads(response.text)

    return data


# Up to 25 matches at a time
matches = [] 

matchesdata = getGQLquery(matches)

print(matchesdata)
