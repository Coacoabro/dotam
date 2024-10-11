import requests
import json

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
    # with open('./json/facet_nums.json', 'w') as f:
    #     json.dump(facet_nums_json, f)

get_facets()
# get_innate()
        
    

