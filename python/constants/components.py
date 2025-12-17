#!/usr/bin/env python3

from collections import Counter
from dotenv import load_dotenv

import os
import json
import requests

load_dotenv()

graphql_token = os.environ.get('NEXT_PUBLIC_REACT_APP_TOKEN')

url = 'https://api.stratz.com/graphql' #GraphQL Endpoint
headers = {'Authorization': f'Bearer {graphql_token}'}

constquery = """
    query {
        constants {
            items {
                id
                displayName
                components {
                    componentId
                }
                stat {
                    itemResult
                    isPurchasable
                }
            }
        }
    }
"""

constresponse = requests.post(url, headers=headers, json={'query': constquery})
constdata = json.loads(constresponse.text)
itemsData = constdata['data']['constants']['items']

FullItems = [1, 48, 50, 63, 65, 81, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114,
              116, 119, 121, 123, 125, 127, 131, 133, 135, 137, 139, 141, 143, 145, 
              147, 149, 151, 152, 154, 156, 158, 160, 162, 164, 166, 168, 170, 172, 
              174, 176, 180, 185, 190, 193, 194, 196, 201, 202, 203, 204, 206, 208, 
              210, 214, 220, 223, 225, 226, 229, 231, 232, 235, 236, 242, 247, 249, 
              250, 252, 254, 256, 259, 263, 267, 269, 271, 273, 277, 534, 596, 598, 
              600, 603, 604, 609, 610, 635, 931, 939, 1097, 1107, 1466, 1806, 1808]

Early = [34, 36, 41, 73, 75, 77, 88, 178, 181, 240, 244, 569, 596]

Items = {}

for item in itemsData:
    stat = item['stat']
    if stat:
        if stat['isPurchasable']:
            components = item['components']
            if components:
                for component in components:
                    componentId = component['componentId']
                    if componentId in Early or componentId in FullItems:
                        if componentId not in Items:
                            Items[componentId] = [stat['itemResult']]
                        else:
                            Items[componentId].append(stat['itemResult'])

with open("components.json", "w") as json_file:
    json.dump(Items, json_file, indent=4)  
