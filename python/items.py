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

for hero_id in hero_ids:
    query = f"""
        query {{
            heroStats {{
                itemBootPurchase(heroId: {hero_id}) {{
                    itemId
                    timeAverage
                    winCount
                    matchCount
                }}
                itemStartingPurchase(heroId: {hero_id}) {{
                    itemId
                    winCount
                    matchCount
                    wasGiven
                }}
                itemNeutral(heroId: {hero_id}) {{
                    itemId
                    equippedMatchCount
                    equippedMatchWinCount
                    item {{
                            displayName
                            image
                            stat {{
                                neutralItemTier
                        }}
                    }}
                }}
            }}
        }}
    """
