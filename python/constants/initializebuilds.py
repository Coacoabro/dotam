#!/usr/bin/env python3

import psycopg2
import json
import requests
import os

from dotenv import load_dotenv

load_dotenv()

base_url = 'https://www.dota2.com/datafeed/herodata?language=english&hero_id='


def get_innate():
    innate_json = {}

    for i in range(1, 139):

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
    facets_json = {}
    facet_nums_json = {}

    for i in range(1, 139):

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
                    hero_facets.append( {"Name": facet["name"] , "Title": facet["title_loc"], "Desc": facet["description_loc"], "Icon": facet["icon"]} )
                    facet_nums.append(n)
                
                facet_nums_json[i] = facet_nums
                facets_json[i] = hero_facets

    with open('./json/hero_facets.json', 'w') as f:
        json.dump(facets_json, f)
    with open('./json/facet_nums.json', 'w') as f:
        json.dump(facet_nums_json, f)


get_facets()
get_innate()

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

# Update on my S3 cloudfront bucket
res = requests.get("https://dhpoqm1ofsbx7.cloudfront.net/patch.txt")
patch = res.text

Roles = ['POSITION_1', 'POSITION_2', 'POSITION_3', 'POSITION_4', 'POSITION_5']
Ranks = ['', 'HERALD', 'GUARDIAN', 'CRUSADER', 'ARCHON', 'LEGEND', 'ANCIENT', 'DIVINE', 'IMMORTAL', 'LOW', 'MID', 'HIGH']
file_path = './json/hero_facets.json'
with open(file_path, 'r') as file:
    Facets = json.load(file)


for hero_id in hero_ids:
    num_facets = len(Facets[str(hero_id)])
    hero_facet = list(range(1, num_facets + 1))
    for rank in Ranks:
        for role in Roles:
            for facet in hero_facet:
                
                cur.execute("""
                    INSERT INTO main (hero_id, rank, role, facet, patch, total_matches, total_wins) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (hero_id, rank, role, facet, patch, 0, 0))


conn.commit()
conn.close()
print("Initialization Finished")