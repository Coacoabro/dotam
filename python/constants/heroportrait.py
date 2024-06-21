import requests
import os
import json

with open('./dotaconstants/build/heroes.json', 'r') as f:  # replace with actual path
    data = json.load(f)

base_url = "https://cdn.cloudflare.steamstatic.com"

public_dir = "./public/hero_portraits"

for _, hero in data.items():
    img_path = hero['img']
    hero_name = hero['name'].replace('npc_dota_hero_', '')
    url = base_url + img_path

    response = requests.get(url)

    if response.status_code == 200:
        with open(f"{public_dir}/{hero_name}.png", 'wb') as f:
            f.write(response.content)
