#!/usr/bin/env python3

import time
import psycopg2
import boto3
import json
import requests
import os
import psutil
import copy
import traceback

from datetime import datetime, timezone
from dotenv import load_dotenv
from collections import Counter
from collections import defaultdict
from botocore.exceptions import ClientError
from concurrent.futures import ThreadPoolExecutor

load_dotenv()


start_time = time.time()

# Telegram Stuff

BOT_TOKEN = "8073220272:AAGVRtXb7LRM0H4h3KizX5GfbfqLGDj6S1s"  # From BotFather
CHAT_ID = "529384584"  # From userinfobot

def send_telegram_message(bot_token, chat_id, message):
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message
    }
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        print("Telegram notification sent!")
    else:
        print(f"Failed to send Telegram message: {response.status_code} - {response.text}")

# file_path = '/home/ec2-user/dotam/python/daily/seq_num.json'
# facet_path = '/home/ec2-user/dotam/python/daily/facet_nums.json'
# ranked_path = '/home/ec2-user/dotam/python/daily/ranked_matches.json'
file_path = './python/daily/seq_num.json'
facet_path = './python/daily/facet_nums.json'
ranked_path = './python/temp/ranked_matches_1.json'


with open(file_path, 'r') as file:
    data = json.load(file)
    seq_num = data['seq_num']

with open(facet_path, 'r') as file:
    facet_nums = json.load(file)

ranked_matches = []
all_ranked_matches = []

hourlyDump = 0
builds = {}
build_index = {}

sent_already = False

m = 0

while True:
    try:
        
        # Steam's Web API Alternating
        API_KEY = os.environ.get('DOTA_API_KEY_A')
        if hourlyDump % 2 == 0:
            API_KEY = os.environ.get('DOTA_API_KEY_K')

        SEQ_URL = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistoryBySequenceNum/v1/?key=' + API_KEY + '&start_at_match_seq_num='    
        DOTA_2_URL = SEQ_URL + str(seq_num)
        
        response = requests.get(DOTA_2_URL, timeout=600)

        if response.status_code == 200:
            backoff = 10
            m += 1
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
                    if len(ranked_matches) == 100:
                        hourlyDump += 1
                        print(hourlyDump)
                        all_ranked_matches.append(ranked_matches)
                        ranked_matches = []
        elif response.status_code == 429:
            print(f'Too many requests, waiting {backoff} seconds')
            time.sleep(backoff)
            backoff = min(backoff + 10, 30)
        else:
            print("An error occured: ", response.status_code)
        
        if hourlyDump >= 100:
            with open(ranked_path, 'w') as file:
                json.dump(all_ranked_matches, file)
            with open(file_path, 'w') as file:
                json.dump({"seq_num": seq_num}, file)
            break

    except Exception as e:
        error_message = f"An error occurred in your script:\n\n{str(e)}"
        print(error_message)
        if str(e) == "local variable 'data' referenced before assignment":
            send_telegram_message(BOT_TOKEN, CHAT_ID, "Referenced before assignment, aborting mission")
            break
        else:
            send_telegram_message(BOT_TOKEN, CHAT_ID, error_message)




end_time = time.time()
elapsed_time = end_time - start_time

time_message = f"Finished gathering ranked matches. That took {round((elapsed_time/60), 2)} minutes and {m} calls to the Web API"
print(time_message)