import time
import psycopg2
import boto3
import json
import requests
import os
import psutil
import copy
import traceback
import clickhouse_connect

from datetime import date, datetime, timezone
from dotenv import load_dotenv
from collections import Counter
from collections import defaultdict
from botocore.exceptions import ClientError
from botocore.config import Config
from concurrent.futures import ThreadPoolExecutor, as_completed, TimeoutError
from multiprocessing import Process, Queue

load_dotenv()


# My Amazon Database
database_url = os.environ.get('DATABASE_URL')

# Getting all hero ids
conn = psycopg2.connect(database_url)
cur = conn.cursor()
cur.execute("SELECT * from heroes;")
heroes = cur.fetchall()
conn.close()

client = clickhouse_connect.get_client(
    host=os.getenv('CLICKHOUSE_HOST'),
    user='default',
    password=os.getenv('CLICKHOUSE_KEY'),
    secure=True
)

updated_heroes = []

for hero in heroes:
    updated_heroes.append(hero[:-1])

client.insert('heroes', updated_heroes)