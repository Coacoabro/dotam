#!/usr/bin/env python3

import time
import psycopg2
import json
import requests
import os

from dotenv import load_dotenv

load_dotenv()

database_url = os.environ.get('DATABASE_URL')
graphql_token = os.environ.get('NEXT_PUBLIC_REACT_APP_TOKEN')

url = 'https://api.stratz.com/graphql' #GraphQL Endpoint
headers = {'Authorization': f'Bearer {graphql_token}'}

conn = psycopg2.connect(database_url)
cur = conn.cursor() # Open a cursor to perform database operations

cur.execute("SELECT * from rates WHERE rank = 'IMMORTAL' and pickrate > 0.0049;")



# Steam's Web API
API_KEY = os.environ.get('DOTA_API_KEY')
SEQ_URL = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistoryBySequenceNum/v1/?start_at_match_seq_num='
MATCH_URL = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v1/?key=4392C8D826954FCC8251C025E2010342&match_id=7699115115'

# OpenDota's API
PUBLIC_MATCHES_URL = 'https://api.opendota.com/api/publicMatches'

seq_num_start = 6121215528

stored_matches = []

while True:
    i = 0
    while i < 1920:
        response1 = requests.get(PUBLIC_MATCHES_URL)
        if response1.status_code == 200:
            match_id_start = response1.json()[0]['match_id']
        url = f'{PUBLIC_MATCHES_URL}?less_than_match_id={match_id_start}&min_rank=81'
        response = requests.get(url)
        if response.status_code == 200:
            matches = response.json()
            for match in matches:
                stored_matches.append(match['match_id'])
            match_id_start = matches[-1]['match_id']
        time.sleep(45)
        i += 1
        