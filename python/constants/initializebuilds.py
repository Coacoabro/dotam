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
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor

load_dotenv()

newest_hero_id = 150

base_url = 'https://www.dota2.com/datafeed/herodata?language=english&hero_id='

res = requests.get("https://dhpoqm1ofsbx7.cloudfront.net/patch.txt")
# patch = res.text
patch = "7.39"

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


def s3_data():

    global patch

    s3 = boto3.client('s3')

    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()

    cur.execute("SELECT hero_id from heroes;")
    hero_ids = [row[0] for row in cur.fetchall()]
    conn.close()

    Roles = ['POSITION_1', 'POSITION_2', 'POSITION_3', 'POSITION_4', 'POSITION_5']
    Ranks = ['', 'HERALD', 'GUARDIAN', 'CRUSADER', 'ARCHON', 'LEGEND', 'ANCIENT', 'DIVINE', 'IMMORTAL', 'LOW', 'MID', 'HIGH']
    file_path = './json/hero_facets.json'
    with open(file_path, 'r') as file:
        Facets = json.load(file)
    
    with ThreadPoolExecutor(max_workers=20) as executor:
        for hero_id in hero_ids:
            num_facets = len(Facets[str(hero_id)])
            hero_facet = list(range(1, num_facets + 1))
            for rank in Ranks: 
                summary = defaultdict(dict)
                data = defaultdict(dict)
                abilities = defaultdict(dict)
                items = defaultdict(dict)
                builds = defaultdict(dict)
                for role in Roles:
                    for facet in hero_facet:
                        summary[role][facet] = {
                            "total_matches": 0, 
                            "total_wins": 0
                        }
                        data[role][facet] = []
                        abilities[role][facet] = {
                            "abilities": None, 
                            "talents": None
                        }
                        items[role][facet] = {
                            "starting": None, 
                            "early": None, 
                            "core": None, 
                            "neutrals":None
                        }
                        builds[role][facet] = {
                            "abilities": None,
                            "talents": None,
                            "items": {
                                "starting": None,
                                "early": None,
                                "core": None,
                                "neutrals": None
                            }
                        }
                        
                summary = json.loads(json.dumps(summary))
                data = json.loads(json.dumps(data))
                s3_key = f"data/{patch}/{hero_id}/{rank}/summary.json"
                s3_data_key = f"data/{patch}/{hero_id}/{rank}/data.json"
                s3_abilities_key = f"data/{patch}/{hero_id}/{rank}/abilities.json"
                s3_items_key = f"data/{patch}/{hero_id}/{rank}/items.json"
                s3_builds_key = f"data/{patch}/{hero_id}/{rank}/builds.json"
                executor.submit(s3.put_object, Bucket='dotam-builds', Key=s3_key, Body=json.dumps(summary, indent=2))
                executor.submit(s3.put_object, Bucket='dotam-builds', Key=s3_data_key, Body=json.dumps(data, indent=2))
                executor.submit(s3.put_object, Bucket='dotam-builds', Key=s3_abilities_key, Body=json.dumps(abilities, indent=2))
                executor.submit(s3.put_object, Bucket='dotam-builds', Key=s3_items_key, Body=json.dumps(items, indent=2))
                executor.submit(s3.put_object, Bucket='dotam-builds', Key=s3_builds_key, Body=json.dumps(builds, indent=2))
            
def hero_info():

    global patch

    s3 = boto3.client('s3')

    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()

    cur.execute("SELECT hero_id from heroes;")
    hero_ids = [row[0] for row in cur.fetchall()]

    heroes = []

    with ThreadPoolExecutor(max_workers=20) as executor:

        for hero_id in hero_ids:

            cur.execute("SELECT * FROM heroes WHERE hero_id = %s", [hero_id])
            hero = cur.fetchall()
            hero = hero[0]
            heroObj = {}
            heroObj['hero_id'] = hero[0]
            heroObj['name'] = hero[1]
            heroObj['localized_name'] = hero[2]
            heroObj['img'] = hero[3]
            heroObj['attr'] = hero[4]

            executor.submit(s3.put_object, Bucket='dotam-content', Key=f"data/{patch}/{hero_id}/info.json", Body=json.dumps(heroObj, indent=2))
            heroes.append(heroObj)
    
    s3.put_object(Bucket='dotam-content', Key=f"data/heroes.json", Body=json.dumps(heroes, indent=2))


    
## All of these are used (INCLUDING HERO INFO!!)
# get_facets()
# get_innate()
# s3_data()
hero_info()


### postgres_data() # NO LONGER USED


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


print("Initialization Finished")