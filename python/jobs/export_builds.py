import os
import json
import requests
import clickhouse_connect
from pathlib import Path
from pyspark.sql import SparkSession
from pyspark.sql import functions as F

from hero_ids import hero_ids

from dotenv import load_dotenv
from botocore.config import Config
from collections import defaultdict
from datetime import date, datetime, timezone

load_dotenv()

res = requests.get("https://dhpoqm1ofsbx7.cloudfront.net/patch.txt")
patch = res.text

client = clickhouse_connect.get_client(
    host=os.getenv('CLICKHOUSE_HOST'),
    user='default',
    password=os.getenv('CLICKHOUSE_KEY'),
    secure=True,
    connect_timeout=600,
    send_receive_timeout=600
)

