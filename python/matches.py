#!/usr/bin/env python3

import time
import psycopg2
import json
import requests
import os

from dotenv import load_dotenv

load_dotenv()

API_KEY = os.environ.get('DOTA_API_KEY')
BASE_URL = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistoryBySequenceNum/v1/?start_at_match_seq_num='

seq_num_start = 6121215528

stored_matches = []

while True:
    url = f'{BASE_URL}{seq_num_start}&key={API_KEY}'
    response = requests.get(url)
    if response.status_code == 200:
        matches = response.json()['result']['matches']
        for match in matches:
            stored_matches.append(match['match_id'])
        seq_num_start = matches[-1]['match_seq_num']
    print(stored_matches)
    time.sleep(3)
        