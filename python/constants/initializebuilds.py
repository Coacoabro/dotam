#!/usr/bin/env python3

import psycopg2
import json
import requests
import os
import boto3
import datetime

from datetime import datetime
from dotenv import load_dotenv
from psycopg2.extras import execute_values

load_dotenv()

newest_hero_id = 150

base_url = 'https://www.dota2.com/datafeed/herodata?language=english&hero_id='

def get_innate():
    global newest_hero_id
    innate_json = {}
    

    for i in range(1, newest_hero_id):

        url = base_url + str(i)

        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()

            if data["result"]["data"]["heroes"]:
                abilities = data["result"]["data"]["heroes"][0]["abilities"]
                for ability in abilities:
                    if ability["ability_is_innate"]:
                        ability_desc = ability["desc_loc"]
                        placeholders = [placeholder.strip('%') for placeholder in ability_desc.split('%')[1::2]]
                        for placeholder in placeholders:
                            special_values = ability["special_values"]
                            value = ''
                            if placeholder == '':
                                value = '%'
                            else:
                                for special_value in special_values:
                                    if special_value["name"] == placeholder:
                                        float_values = special_value["values_float"]
                                        if len(float_values) > 1:
                                            for float_value in float_values:
                                                value += str(float_value) + '/'
                                            value = value[:-1]
                                        else:
                                            value = float_values[0]
                            ability_desc = ability_desc.replace(f'%{placeholder}%', str(value))
                        
                        innate_json[i] = {"Name": ability["name_loc"], "Desc": ability_desc}


    with open('./json/hero_innate.json', 'w') as f:
        json.dump(innate_json, f)

def get_facets():
    # This grabs new Facets as well as the amount of facets each hero has for the backend and front end
    facets_json = {}
    facet_nums_json = {}
    
    global newest_hero_id

    for i in range(1, newest_hero_id):

        url = base_url + str(i)

        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()

            if data["result"]["data"]["heroes"]:
                facets = data["result"]["data"]["heroes"][0]["facets"]
                hero_facets = []
                facet_nums = []
                n = 0
                for facet in facets:
                    n += 1
                    facet_desc = facet["description_loc"]
                    percentPlaceholders = [placeholder.strip('%') for placeholder in facet_desc.split('%')[1::2]]
                    for placeholder in percentPlaceholders:
                        value = ''
                        if placeholder == '':
                            value = '%'
                        else:
                            for abilities in data["result"]["data"]["heroes"][0]['facet_abilities']:
                                if len(abilities['abilities']) > 0:
                                    special_values = abilities['abilities'][0]["special_values"]
                                    for special_value in special_values:
                                        if special_value["name"] == placeholder:
                                            float_values = special_value["values_float"]
                                            if len(float_values) > 1:
                                                for float_value in float_values:
                                                    value += str(float_value) + '/'
                                                value = value[:-1]
                                            else:
                                                value = float_values[0]
                        
                        facet_desc = facet_desc.replace(f'%{placeholder}%', str(value))
                                    
                    hero_facets.append( {"Name": facet["name"] , "Title": facet["title_loc"], "Desc": facet_desc, "Icon": facet["icon"]} )
                    facet_nums.append(n)
                
                facet_nums_json[i] = facet_nums
                facets_json[i] = hero_facets

    with open('./json/hero_facets.json', 'w') as f:
        json.dump(facets_json, f)
    with open('./json/facet_nums.json', 'w') as f:
        json.dump(facet_nums_json, f)

# get_facets()
# get_innate()

## Make Sure Everythings Up to Date

client = boto3.client('cloudfront')

response = client.create_invalidation(
    DistributionId='E2UJP3F27QO2FJ',  # Replace with your CloudFront Distribution ID
    InvalidationBatch={
        'Paths': {
            'Quantity': 1,  # Number of paths to invalidate
            'Items': [
                '/*',  # Invalidate all files; use specific paths for individual files
            ]
        },
        'CallerReference': str(datetime.now())  # Unique string to prevent duplicate invalidations
    }
)

# My Amazon Database
database_url = os.environ.get('DATABASE_URL')
builds_database_url = os.environ.get('BUILDS_DATABASE_URL')
conn = psycopg2.connect(database_url)
cur = conn.cursor()

cur.execute("SELECT hero_id from heroes;")
hero_ids = [row[0] for row in cur.fetchall()]
conn.close()

conn = psycopg2.connect(builds_database_url)
cur = conn.cursor()

previous_patch = "7.38b"
res = requests.get("https://dhpoqm1ofsbx7.cloudfront.net/patch.txt")
patch = res.text

Roles = ['POSITION_1', 'POSITION_2', 'POSITION_3', 'POSITION_4', 'POSITION_5']
Ranks = ['', 'HERALD', 'GUARDIAN', 'CRUSADER', 'ARCHON', 'LEGEND', 'ANCIENT', 'DIVINE', 'IMMORTAL', 'LOW', 'MID', 'HIGH']
file_path = './json/hero_facets.json'
with open(file_path, 'r') as file:
    Facets = json.load(file)

cur.execute("DELETE FROM main WHERE patch = %s", (previous_patch,))

data = []

for hero_id in hero_ids:
    num_facets = len(Facets[str(hero_id)])
    hero_facet = list(range(1, num_facets + 1))
    for rank in Ranks:
        for role in Roles:
            for facet in hero_facet:
                data.append((hero_id, rank, role, facet, patch, 0, 0))

query = """
    INSERT INTO main (hero_id, rank, role, facet, patch, total_matches, total_wins) 
    VALUES %s
"""

execute_values(cur, query, data)

conn.commit()
conn.close()
print("Initialization Finished")