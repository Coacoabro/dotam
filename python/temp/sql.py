#!/usr/bin/env python3

import psycopg2
import requests
import os

from dotenv import load_dotenv

load_dotenv()

# My Amazon Database
database_url = os.environ.get('DATABASE_URL')
builds_database_url = os.environ.get('BUILDS_DATABASE_URL')

conn = psycopg2.connect(builds_database_url)
cur = conn.cursor()

cur.execute("""
    CREATE INDEX late_index ON late (build_id, core_items, nth, item)
""")

conn.commit()
conn.close()