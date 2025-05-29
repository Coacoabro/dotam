#!/usr/bin/env python3

import time
import psycopg2
import boto3
import io
import json
import requests
import os
import psutil
import copy
import traceback
import pandas
import pyarrow
import pyarrow.parquet as pq

from datetime import datetime, timezone
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
cur.execute("SELECT hero_id from heroes;")
hero_ids = [row[0] for row in cur.fetchall()]
conn.close()

res = requests.get("https://dhpoqm1ofsbx7.cloudfront.net/patch.txt")
patch = res.text

config = Config(
    connect_timeout=5,
    read_timeout=60,
    retries={
        'max_attempts': 3,
        'mode': 'standard'
    }
)
s3 = boto3.client('s3', config=config)

Ranks = ['', 'HERALD', 'GUARDIAN', 'CRUSADER', 'ARCHON', 'LEGEND', 'ANCIENT', 'DIVINE', 'IMMORTAL', 'LOW', 'MID', 'HIGH']
build_labels = ["abilities", "talents", "starting", "early", "core", "neutrals"]

blank_structure = {
    "abilities": [],
    "talents": [],
    "starting": [],
    "early": [],
    "core": [],
    "neutrals": []
}

for hero_id in hero_ids:
    for rank in Ranks:
        # Grabbing Data
        s3_data_key = f"data/{patch}/{hero_id}/{rank}/data.json"
        data_obj = s3.get_object(Bucket='dotam-builds', Key=s3_data_key)
        existing_data = json.loads(data_obj['Body'].read().decode('utf-8'))

        for position, facets in existing_data.items():
            for facet, categories in facets.items():
                if categories == []:
                    existing_data[position][facet] = blank_structure
                else:
                    labeled = dict(zip(build_labels, categories))
                    if "core" in labeled:
                        for build in labeled["core"]:
                            if "Late" in build and not build["Late"]:
                                del build["Late"]
                    
                    existing_data[position][facet] = labeled

        
                



        # parquet_bytes = data_obj['Body'].read()
        # buf = io.BytesIO(parquet_bytes)
        # table = pq.read_table(buf)
        # nested_data = table.column('data')[0].as_py()

        # with open("./python/temp/data.json", 'w') as file:
        #     json.dump(existing_data, file)


        table = pyarrow.table({"data": [existing_data]})
        buf = io.BytesIO()
        pq.write_table(table,buf)
        buf.seek(0)

        parquet_key = f"data/{patch}/{hero_id}/{rank}/data.parquet"
        s3.put_object(Bucket="dotam-builds", Key=parquet_key, Body=buf.read())
        print(f"DONE: {hero_id} {rank}")








