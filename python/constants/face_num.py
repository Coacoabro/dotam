import json

abilities_path = './dotaconstants/build/hero_abilities.json'
facet_path = './python/daily/facet_nums.json'
hero_path = './dotaconstants/build/heroes.json'

with open(abilities_path, 'r') as file:
    abilities = json.load(file)

with open(hero_path, 'r') as file:
    heroes = json.load(file)

facet_nums = {}

for hero, details in abilities.items():
    if "facets" in details:
        hero_id = 0
        for hero_info, info in heroes.items():
            if info["name"] == hero:
                hero_id = info["id"]
                break
        facet_nums[hero_id] = [
            facet["id"] + 1 for facet in details["facets"] if "deprecated" not in facet
        ]

with open(facet_path, 'w') as f:
    json.dump(facet_nums, f)
