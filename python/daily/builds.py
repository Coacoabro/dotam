#!/usr/bin/env python3

import time
import psycopg2
import json
import requests
import os
import psutil
import copy

from dotenv import load_dotenv
from collections import Counter

# UPDATES
# Starting Items - Forgot to make sure they are sorted when comparing them

start_time = time.time()

load_dotenv()

# Steam's Web API
API_KEY = os.environ.get('DOTA_API_KEY')
SEQ_URL = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistoryBySequenceNum/v1/?key=' + API_KEY + '&start_at_match_seq_num='    

# My Amazon Database
database_url = os.environ.get('DATABASE_URL')
builds_database_url = os.environ.get('BUILDS_DATABASE_URL')

# Getting all hero ids
conn = psycopg2.connect(database_url)
cur = conn.cursor()
cur.execute("SELECT hero_id from heroes;")
hero_ids = [row[0] for row in cur.fetchall()]
conn.close()

conn = psycopg2.connect(builds_database_url, connect_timeout=600)
cur = conn.cursor()

res = requests.get("https://dhpoqm1ofsbx7.cloudfront.net/patch.txt")
patch = res.text

item_req = requests.get("https://www.dota2.com/datafeed/itemlist?language=english")
item_res = item_res.json()
item_list = item_res['result']['data']['itemabilities']

def actualRank(rank):
    if rank >= 80:
        return ["IMMORTAL", "HIGH"]
    elif rank >= 70:
        return ["DIVINE", "HIGH"]
    elif rank >= 60:
        return ["ANCIENT", "HIGH"]
    elif rank >= 50:
        return ["LEGEND", "MID"]
    elif rank >= 40:
        return ["ARCHON", "MID"]
    elif rank >= 30:
        return ["CRUSADER", "LOW"]
    elif rank >= 20:
        return ["GUARDIAN", "LOW"]
    else:
        return ["HERALD", "LOW"]

def getBuilds(ranked_matches, builds):

    global patch
    global facet_nums

    # Stratz API
    graphql_token = os.environ.get('NEXT_PUBLIC_REACT_APP_TOKEN')
    stratz_url = 'https://api.stratz.com/graphql' #GraphQL Endpoint
    stratz_headers = {'Authorization': f'Bearer {graphql_token}', 'User-Agent': 'STRATZ_API'}

    Boots = [48, 50, 63, 180, 214, 220, 231, 931] #Brown Boots ID is 29
    Support = [30, 40, 42, 43, 45, 188, 257, 286]
    Consumable = [38, 39, 44, 216, 241, 265, 4204, 4205, 4026]

    Early = [29, 34, 36, 41, 73, 75, 77, 88, 178, 181, 240, 244, 569]
    SupportFull = [37, 79, 90, 92, 102, 226, 231, 254, 269, 1128]
    FullItems = [1, 48, 50, 63, 65, 81, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114,
                116, 119, 121, 123, 125, 127, 131, 133, 135, 137, 139, 141, 143, 145, 
                147, 149, 151, 152, 154, 156, 158, 160, 162, 164, 166, 168, 170, 172, 
                174, 176, 180, 185, 190, 193, 194, 196, 201, 202, 203, 204, 206, 208, 
                210, 214, 220, 223, 225, 226, 229, 231, 232, 235, 236, 242, 247, 249, 
                250, 252, 254, 256, 259, 263, 267, 269, 271, 273, 277, 534, 596, 598, 
                600, 603, 604, 609, 610, 635, 931, 939, 1097, 1107, 1466, 1806, 1808] 
    Swords = [162, 170, 259]

    NeutralTokens = [2091, 2092, 2093, 2094, 2095]

    fragment = """
        fragment MatchData on MatchType {
            actualRank
            players {
                position
                abilities {
                    abilityId
                    isTalent
                }
                stats {
                    itemPurchases {
                        itemId
                        time
                    }
                    inventoryReport {
                        neutral0 {
                            itemId
                        }
                    }
                }
            }
        }
    """

    matches_query = "\n".join([f"{'match_' + str(ranked_match['match_id'])}: match(id: {ranked_match['match_id']}) {{ ...MatchData }}" for ranked_match in ranked_matches])

    query = f"""
        query MyQuery {{
            {matches_query}
        }}
        {fragment}
    """
    
    response = requests.post(stratz_url, json={'query': query}, headers=stratz_headers, timeout=600)
    data = json.loads(response.text)

    for ranked_match in ranked_matches:
        match_id = ranked_match['match_id']
        # print(data)
        gqlmatch = data['data']['match_' + str(match_id)]
        if gqlmatch:
            rank = actualRank(gqlmatch['actualRank'])
            players = gqlmatch['players']
            for n, player in enumerate(players):
                purchasedItems = player['stats']['itemPurchases']
                neutralEvents = player['stats']['inventoryReport']
                if purchasedItems:
                    hero_id = ranked_match['players'][n]['id']
                    role = player['position']
                    facet = ranked_match['players'][n]['facet']
                    win = ranked_match['players'][n]['won']

                    if facet in facet_nums[str(hero_id)]:
                        facet = facet_nums[str(hero_id)].index(facet) + 1
                        abilityEvents = player['abilities']
                        abilities = []
                        talents = []

                        for ability in abilityEvents:
                            if ability['abilityId'] != 730 and len(talents) < 4:
                                if ability['isTalent']:
                                    talents.append(ability['abilityId'])
                                    if len(abilities) < 16:
                                        abilities.append(-1)
                                elif len(abilities) < 16:
                                    abilities.append(ability['abilityId'])
                        
                        # If a hero hits level 16 at least then we should have enough info for items and what not
                        if len(abilities) == 16:
                            isSupport = False
                            if role == 'POSITION_4' or role == 'POSITION_5':
                                isSupport = True

                            # Starting Game Items
                            startingItems = []
                            for staritem in purchasedItems:
                                item_id = staritem['itemId']
                                if staritem['time'] < 0 and len(startingItems) < 6:
                                    startingItems.append(item_id)
                            
                            # Early Game Items
                            earlyItems = []
                            tempItemArray = []
                            secondItems = []
                            for earlitem in purchasedItems:
                                item_id = earlitem['itemId']
                                if earlitem['time'] < 900 and item_id in Early:
                                    secondPurchase = False
                                    if item_id in tempItemArray:
                                        secondPurchase = True
                                    if item_id not in secondItems:
                                        tempItemArray.append(item_id)
                                        earlyItems.append({'Item': item_id, 'isSecondPurchase': secondPurchase})
                                    if secondPurchase:
                                        secondItems.append(item_id)

                            # Generating Core Items and Full Items Purchased Order
                            itemBuild = []
                            for item in purchasedItems:
                                if item['itemId'] not in itemBuild:
                                    isSecondSword = False
                                    if item['itemId'] in Swords:
                                        if itemBuild and itemBuild[-1] in Swords:
                                            isSecondSword = True
                                    if isSecondSword == False:
                                        if isSupport == True:
                                            if item['itemId'] in SupportFull or item['itemId'] in FullItems:
                                                itemBuild.append(item['itemId'])
                                        else:
                                            if item['itemId'] in FullItems:
                                                itemBuild.append(item['itemId'])

                            if len(itemBuild) >= 2 and isSupport == True:
                                core = itemBuild[:2]
                            elif len(itemBuild) >= 3 and isSupport == False:
                                core = itemBuild[:3]
                            else:
                                core = None
                            
                            # Neutral Items
                            neutralItems = []
                            for neutralEvent in neutralEvents:
                                if neutralEvent['neutral0'] != None:
                                    neutral = neutralEvent['neutral0']['itemId']
                                    if neutral not in neutralItems and neutral not in NeutralTokens:
                                        neutralItems.append(neutral)
                            
                            if core:
                                rankBuildFound = False # Specific Rank Build
                                lmhBuildFound = False # Low Mid High Build
                                allBuildFound = False # "" Build
                                for hero_build in builds:
                                    if hero_build[0] == hero_id and (hero_build[1] == rank[0] or hero_build[1] == rank[1] or hero_build[1] == "") and hero_build[2] == role and hero_build[3] == facet:
                                        if hero_build[1] == rank[0] and not rankBuildFound:
                                            hero_build[4] += 1
                                            hero_build[5] += win
                                            rankBuildFound = True

                                        elif hero_build[1] == rank[1] and not lmhBuildFound:
                                            hero_build[4] += 1
                                            hero_build[5] += win
                                            lmhBuildFound = True

                                        elif hero_build[1] == "" and not allBuildFound:
                                            hero_build[4] += 1
                                            hero_build[5] += win
                                            allBuildFound = True
                                        
                                        
                                        
                                        # print(f"{hero_build[0]} {hero_build[1]} {hero_build[2]} {hero_build[3]}: {hero_build[4]}")

                                        abilitiesFound = False
                                        currentAbilities = copy.deepcopy(hero_build[6])
                                        for abilityBuild in currentAbilities:
                                            if abilityBuild['Abilities'] == abilities:
                                                abilityBuild['Wins'] += win
                                                abilityBuild['Matches'] += 1
                                                abilitiesFound = True
                                                hero_build[6] = currentAbilities
                                                break
                                        if not abilitiesFound:
                                            hero_build[6].append({'Abilities': abilities, 'Wins': win, 'Matches': 1})
                                        
                                        for talent in talents:
                                            talentFound = False
                                            currentTalents = copy.deepcopy(hero_build[7])
                                            for talentBuild in currentTalents:
                                                if talentBuild['Talent'] == talent:
                                                    talentBuild['Wins'] += win
                                                    talentBuild['Matches'] += 1
                                                    talentFound = True
                                                    hero_build[7] = currentTalents
                                                    break
                                            if not talentFound:
                                                hero_build[7].append({'Talent': talent, 'Wins': win, 'Matches': 1})

                                        startingFound = False
                                        currentStarting = copy.deepcopy(hero_build[8])
                                        for startingBuild in currentStarting:
                                            if sorted(startingBuild['Starting']) == sorted(startingItems):
                                                startingBuild['Wins'] += win
                                                startingBuild['Matches'] += 1
                                                startingFound = True
                                                hero_build[8] = currentStarting
                                                break
                                        if not startingFound:
                                            hero_build[8].append({'Starting': sorted(startingItems), 'Wins': win, 'Matches': 1})

                                        currentEarly = copy.deepcopy(hero_build[9])
                                        for earlyGameItem in earlyItems:
                                            earlyFound = False
                                            for earlyItem in currentEarly:
                                                if earlyItem['Item'] == earlyGameItem['Item'] and earlyItem['isSecondPurchase'] == earlyGameItem['isSecondPurchase']:
                                                    earlyItem['Matches'] += 1
                                                    earlyItem['Wins'] += win
                                                    earlyFound = True
                                                    hero_build[9] = currentEarly
                                                    break
                                            if not earlyFound:
                                                hero_build[9].append({'Item': earlyGameItem['Item'], 'isSecondPurchase': earlyGameItem['isSecondPurchase'], 'Wins': win, 'Matches': 1})

                                        buildFound = False
                                        currentCore = copy.deepcopy(hero_build[10])
                                        for build in currentCore:
                                            if build['Core'] == core:
                                                build['Wins'] += win
                                                build['Matches'] += 1
                                                m = 3 if isSupport else 4
                                                for index in range(m, len(itemBuild)):
                                                    gameItem = itemBuild[index]
                                                    lateFound = False
                                                    for lateItem in build['Late']:
                                                        if gameItem == lateItem['Item'] and m == lateItem['Nth']:
                                                            lateItem['Wins'] += win
                                                            lateItem['Matches'] += 1
                                                            lateFound = True
                                                            break                                                        
                                                    if not lateFound:
                                                        build['Late'].append({'Item': gameItem, 'Nth': m, 'Wins': win, 'Matches': 1})
                                                    m += 1
                                                hero_build[10] = currentCore
                                                buildFound = True
                                                break
                                        if not buildFound:
                                            lateGameItems = []
                                            m = 3 if isSupport else 4
                                            for _ in range(7):
                                                if itemBuild:
                                                    gameItem = itemBuild.pop(0)
                                                    lateGameItems.append({'Item': gameItem, 'Nth': m, 'Wins': win, 'Matches': 1})
                                                m += 1
                                            hero_build[10].append({'Core': core, 'Wins': win, 'Matches': 1, 'Late': lateGameItems})

                                        neutralFound = False
                                        for neutralItem in neutralItems:
                                            neutralFound = False
                                            currentNeutrals = copy.deepcopy(hero_build[11])
                                            for currNeutrals in currentNeutrals:
                                                if currNeutrals['Item'] == neutralItem:
                                                    currNeutrals['Wins'] += win
                                                    currNeutrals['Matches'] += 1
                                                    neutralFound = True
                                                    hero_build[11] = currentNeutrals
                                                    break
                                            if not neutralFound:
                                                hero_build[11].append({'Item': neutralItem, 'Wins': win, 'Matches': 1})
                                        
                                        if rankBuildFound and lmhBuildFound and allBuildFound:
                                            break

                                if not (rankBuildFound and lmhBuildFound and allBuildFound):
                                    finalTalents = []
                                    for finalTalent in talents:
                                        finalTalents.append({'Talent': finalTalent, 'Wins': win, 'Matches': 1})
                                    finalEarlyItems = []
                                    for tempEarlyItem in earlyItems:
                                        finalEarlyItems.append({'Item': tempEarlyItem['Item'], 'isSecondPurchase': tempEarlyItem['isSecondPurchase'], 'Wins': win, 'Matches': 1})
                                    finalCoreItems = []
                                    lateGameItems = []
                                    m = 3 if isSupport else 4
                                    for _ in range(7):
                                        if itemBuild:
                                            gameItem = itemBuild.pop(0)
                                            lateGameItems.append({'Item': gameItem, 'Nth': m, 'Wins': win, 'Matches': 1})
                                        m += 1
                                    finalCoreItems.append({'Core': core, 'Wins': win, 'Matches': 1, 'Late': lateGameItems})
                                    finalNeutrals = []
                                    if len(neutralItems) > 0:
                                        for finalNeutralItem in neutralItems:
                                            finalNeutrals.append({'Item': finalNeutralItem, 'Wins': win, 'Matches': 1})


                                    if not rankBuildFound:
                                        tempBuild = [hero_id, rank[0], role, facet, 1, win, 
                                                    [{'Abilities': abilities, 'Wins': win, 'Matches': 1}], finalTalents, 
                                                    [{'Starting': startingItems, 'Wins': win, 'Matches': 1}], finalEarlyItems,
                                                    finalCoreItems, finalNeutrals]
                                        builds.append(tempBuild)
                                    if not lmhBuildFound:
                                        tempBuild = [hero_id, rank[1], role, facet, 1, win, 
                                                    [{'Abilities': abilities, 'Wins': win, 'Matches': 1}], finalTalents, 
                                                    [{'Starting': startingItems, 'Wins': win, 'Matches': 1}], finalEarlyItems,
                                                    finalCoreItems, finalNeutrals]
                                        builds.append(tempBuild)
                                    if not allBuildFound:
                                        tempBuild = [hero_id, "", role, facet, 1, win, 
                                                    [{'Abilities': abilities, 'Wins': win, 'Matches': 1}], finalTalents, 
                                                    [{'Starting': startingItems, 'Wins': win, 'Matches': 1}], finalEarlyItems,
                                                    finalCoreItems, finalNeutrals]
                                        builds.append(tempBuild)
    
    for build in builds:
        print(build[11])
    return builds

def sendtosql(builds):

    BATCH_SIZE = 500

    # process = psutil.Process()
    # mem_info = process.memory_info()
    # print(f"Resident Set Size: {mem_info.rss / 1024 ** 2:.2f} MB")
    # print(f"Virtual Memory Size: {mem_info.vms / 1024 ** 2:.2f} MB")

    print("Dumping builds")

    total_data = []
    abilities_data = []
    talents_data = []
    starting_items_data = []
    early_items_data = []
    core_items_data = []
    late_items_data = []
    neutral_items_data = []

    unique_identifiers = []
    for build in builds:
        hero_id = build[0]
        rank = build[1]
        role = build[2]
        facet = build[3]
        # cur.execute("""
        #     SELECT * FROM main
        #     WHERE hero_id = %s AND rank = %s AND role = %s AND facet = %s AND patch = %s
        # """, (hero_id, rank, role, facet, patch))
        # tempIdentifier = cur.fetchall()
        # if not tempIdentifier:
        #     print(build)
        unique_identifiers.append((hero_id, rank, role, facet, patch))

    placeholders = ', '.join(['(%s, %s, %s, %s, %s)']*len(unique_identifiers))
    params = [item for sublist in unique_identifiers for item in sublist]

    cur.execute(f"""
        SELECT * FROM main 
        WHERE (hero_id, rank, role, facet, patch) IN ({placeholders})
    """, params)

    build_ids = cur.fetchall()

    print("Obtained all build ids")

    # print(len(build_ids), len(unique_identifiers))
    m = len(builds)

    for build in builds:
        print(m)
        m -= 1
        build_id = None
        for row in build_ids:
            if (row[1], row[2], row[3], row[4], row[5]) == (build[0], build[1], build[2], build[3], patch):
                build_id = row[0]
                break
        total_matches = build[4]
        total_wins = build[5]
        abilities = build[6]
        talents = build[7]
        starting_items = build[8]
        early_items = build[9]
        core_items = build[10]
            neutral_items = build[11]
        neutral_items = build[11]

        # print(build[0], build[1], build[2], build[3], patch, build_id)

        total_data.append((build_id, total_matches, total_wins))
        abilities_data.extend([
            (build_id, abi['Abilities'], abi['Wins'], abi['Matches']) 
            for abi in abilities
        ])
        talents_data.extend([
            (build_id, talent['Talent'], talent['Wins'], talent['Matches']) 
            for talent in talents
        ])
        starting_items_data.extend([
            (build_id, sorted(start['Starting']), start['Wins'], start['Matches']) 
            for start in starting_items
        ])
        early_items_data.extend([
            (build_id, early['Item'], early['isSecondPurchase'], early['Wins'], early['Matches']) 
            for early in early_items
        ])
        
        for core in core_items:
            core_items_data.append((build_id, core['Core'], core['Wins'], core['Matches']))
            late_items_data.extend([
                (build_id, core['Core'], late['Nth'], late['Item'], late['Wins'], late['Matches'])
                for late in core['Late']
            ])
        
        neutral_items_data.extend([
            (build_id, neutral['Item'], neutral['Wins'], neutral['Matches'])
            for neutral in neutral_items
        ])
            total_data.append((build_id, total_matches, total_wins))
            abilities_data.extend([
                (build_id, abi['Abilities'], abi['Wins'], abi['Matches']) 
                for abi in abilities
            ])
            talents_data.extend([
                (build_id, talent['Talent'], talent['Wins'], talent['Matches']) 
                for talent in talents
            ])
            starting_items_data.extend([
                (build_id, sorted(start['Starting']), start['Wins'], start['Matches']) 
                for start in starting_items
            ])
            early_items_data.extend([
                (build_id, early['Item'], early['isSecondPurchase'], early['Wins'], early['Matches']) 
                for early in early_items
            ])
            
            for core in core_items:
                core_items_data.append((build_id, core['Core'], core['Wins'], core['Matches']))
                late_items_data.extend([
                    (build_id, core['Core'], late['Nth'], late['Item'], late['Wins'], late['Matches'])
                    for late in core['Late']
                ])
            
            neutral_items_data.extend([
                (build_id, neutral['Tier'], neutral['Item'], neutral['Wins'], neutral['Matches'])
                for neutral in neutral_items
            ])

        # Total Matches and Wins
        if len(total_data) >= BATCH_SIZE:
            print("Batched total matches")
            placeholders = ', '.join(['(%s, %s, %s)'] * len(total_data))
            query = f"""
                INSERT INTO main (build_id, total_matches, total_wins)
                VALUES {placeholders}
                ON CONFLICT (build_id)
                DO UPDATE SET total_matches = main.total_matches + EXCLUDED.total_matches, total_wins = main.total_wins + EXCLUDED.total_wins
            """
            params = [item for sublist in total_data for item in sublist]
            cur.execute(query, params)
            total_data = []

        # Abilities
        if len(abilities_data) >= BATCH_SIZE:
            print("Batched abilities")
            placeholders = ', '.join(['(%s, %s, %s, %s)'] * len(abilities_data))
            query = f"""
                INSERT INTO abilities (build_id, abilities, wins, matches)
                VALUES {placeholders}
                ON CONFLICT (build_id, abilities)
                DO UPDATE SET wins = abilities.wins + EXCLUDED.wins, matches = abilities.matches + EXCLUDED.matches
            """
            params = [item for sublist in abilities_data for item in sublist]
            cur.execute(query, params)
            abilities_data = []

        # Talents
        if len(talents_data) >= BATCH_SIZE:
            print("Batched talents")
            placeholders = ', '.join(['(%s, %s, %s, %s)'] * len(talents_data))
            query = f"""
                INSERT INTO talents (build_id, talent, wins, matches)
                VALUES {placeholders}
                ON CONFLICT (build_id, talent)
                DO UPDATE SET wins = talents.wins + EXCLUDED.wins, matches = talents.matches + EXCLUDED.matches
            """
            params = [item for sublist in talents_data for item in sublist]
            cur.execute(query, params)
            talents_data = []
        
        # Starting 
        if len(starting_items_data) >= BATCH_SIZE:
            print("Batched starting")
            placeholders = ', '.join(['(%s, %s, %s, %s)'] * len(starting_items_data))
            query = f"""
                INSERT INTO starting (build_id, starting, wins, matches)
                VALUES {placeholders}
                ON CONFLICT (build_id, starting)
                DO UPDATE SET wins = starting.wins + EXCLUDED.wins, matches = starting.matches + EXCLUDED.matches
            """
            params = [item for sublist in starting_items_data for item in sublist]
            cur.execute(query, params)
            starting_items_data = []

        # Early 
        if len(early_items_data) >= BATCH_SIZE:
            print("Batched early")
            placeholders = ', '.join(['(%s, %s, %s, %s, %s)'] * len(early_items_data))
            query = f"""
                INSERT INTO early (build_id, item, secondpurchase, wins, matches)
                VALUES {placeholders}
                ON CONFLICT (build_id, item, secondpurchase)
                DO UPDATE SET wins = early.wins + EXCLUDED.wins, matches = early.matches + EXCLUDED.matches
            """
            params = [item for sublist in early_items_data for item in sublist]
            cur.execute(query, params)
            early_items_data = []
        
        # Core
        if len(core_items_data) >= BATCH_SIZE:
            print("Batched core")
            core_placeholders = ', '.join(['(%s, %s, %s, %s)'] * len(core_items_data))
            core_query = f"""
                INSERT INTO core (build_id, core, wins, matches)
                VALUES {core_placeholders}
                ON CONFLICT (build_id, core)
                DO UPDATE SET wins = core.wins + EXCLUDED.wins, matches = core.matches + EXCLUDED.matches
            """
            core_params = [item for sublist in core_items_data for item in sublist]
            cur.execute(core_query, core_params)
            core_items_data = [] 

        if len(late_items_data) >= BATCH_SIZE:
            print("Batched late")
            late_placeholders = ', '.join(['(%s, %s, %s, %s, %s, %s)'] * len(late_items_data))
            late_query = f"""
                INSERT INTO late (build_id, core_items, nth, item, wins, matches)
                VALUES {late_placeholders}
                ON CONFLICT (build_id, core_items, nth, item)
                DO UPDATE SET wins = late.wins + EXCLUDED.wins, matches = late.matches + EXCLUDED.matches
            """
            late_params = [item for sublist in late_items_data for item in sublist]
            cur.execute(late_query, late_params)
            late_items_data = []
            
            if len(neutral_items_data) >= BATCH_SIZE:
                print("Batched neutrals")
                placeholder = ', '.join(['(%s, %s, %s, %s, %s)'] * len(neutral_items_data))
                query = f"""
                    INSERT INTO neutrals (build_id, tier, item, wins, matches)
                    VALUES {placeholders}
                    ON CONFLICT (build_id, item)
                    DO UPDATE SET wins = neutrals.wins + EXCLUDED.wins, matches = neutrals.matches + EXCLUDED.matches
                """
                params = [item for sublist in neutral_items_data for item in sublist]
                cur.execute(query, params)
                neutral_items_data = []
            

    # IF WE HAVE LEFT OVER DATA
    print("Finished looping through builds, dumping rest")
    if total_data:
        print("Left over total")
        placeholders = ', '.join(['(%s, %s, %s)'] * len(total_data))
        query = f"""
            INSERT INTO main (build_id, total_matches, total_wins)
            VALUES {placeholders}
            ON CONFLICT (build_id)
            DO UPDATE SET total_matches = main.total_matches + EXCLUDED.total_matches, total_wins = main.total_wins + EXCLUDED.total_wins
        """
        params = [item for sublist in total_data for item in sublist]
        cur.execute(query, params)
        total_data = []
        print("Total Data Complete")

    # Abilities
    if abilities_data:
        print("Left over abilities")
        placeholders = ', '.join(['(%s, %s, %s, %s)'] * len(abilities_data))
        query = f"""
            INSERT INTO abilities (build_id, abilities, wins, matches)
            VALUES {placeholders}
            ON CONFLICT (build_id, abilities)
            DO UPDATE SET wins = abilities.wins + EXCLUDED.wins, matches = abilities.matches + EXCLUDED.matches
        """
        params = [item for sublist in abilities_data for item in sublist]
        cur.execute(query, params)
        abilities_data = []
        print("Abilities Data Complete")

    # Talents
    if talents_data:
        print("Left over talents")
        placeholders = ', '.join(['(%s, %s, %s, %s)'] * len(talents_data))
        query = f"""
            INSERT INTO talents (build_id, talent, wins, matches)
            VALUES {placeholders}
            ON CONFLICT (build_id, talent)
            DO UPDATE SET wins = talents.wins + EXCLUDED.wins, matches = talents.matches + EXCLUDED.matches
        """
        params = [item for sublist in talents_data for item in sublist]
        cur.execute(query, params)
        talents_data = []
        print("Talent Data Complete")
    
    # Starting 
    if starting_items_data:
        print("Left over starting")
        placeholders = ', '.join(['(%s, %s, %s, %s)'] * len(starting_items_data))
        query = f"""
            INSERT INTO starting (build_id, starting, wins, matches)
            VALUES {placeholders}
            ON CONFLICT (build_id, starting)
            DO UPDATE SET wins = starting.wins + EXCLUDED.wins, matches = starting.matches + EXCLUDED.matches
        """
        params = [item for sublist in starting_items_data for item in sublist]
        cur.execute(query, params)
        starting_items_data = []
        print("Starting Data Complete")

    # Early 
    if early_items_data:
        print("Left over early")
        placeholders = ', '.join(['(%s, %s, %s, %s, %s)'] * len(early_items_data))
        query = f"""
            INSERT INTO early (build_id, item, secondpurchase, wins, matches)
            VALUES {placeholders}
            ON CONFLICT (build_id, item, secondpurchase)
            DO UPDATE SET wins = early.wins + EXCLUDED.wins, matches = early.matches + EXCLUDED.matches
        """
        params = [item for sublist in early_items_data for item in sublist]
        cur.execute(query, params)
        early_items_data = []
        print("Early Data Complete")
    
    # Core
    if core_items_data:
        print("Left over core")
        core_placeholders = ', '.join(['(%s, %s, %s, %s)'] * len(core_items_data))
        core_query = f"""
            INSERT INTO core (build_id, core, wins, matches)
            VALUES {core_placeholders}
            ON CONFLICT (build_id, core)
            DO UPDATE SET wins = core.wins + EXCLUDED.wins, matches = core.matches + EXCLUDED.matches
        """
        core_params = [item for sublist in core_items_data for item in sublist]
        cur.execute(core_query, core_params)
        core_items_data = []
        print("Core Data Complete") 

    # Late    
    if late_items_data:
        print("Left over late")
        late_placeholders = ', '.join(['(%s, %s, %s, %s, %s, %s)'] * len(late_items_data))
        late_query = f"""
            INSERT INTO late (build_id, core_items, nth, item, wins, matches)
            VALUES {late_placeholders}
            ON CONFLICT (build_id, core_items, nth, item)
            DO UPDATE SET wins = late.wins + EXCLUDED.wins, matches = late.matches + EXCLUDED.matches
        """
        late_params = [item for sublist in late_items_data for item in sublist]
        cur.execute(late_query, late_params)
        late_items_data = []
        print("Late Data Complete")
    
        if neutral_items_data:
            print("Left over neutrals")
            placeholder = ', '.join(['(%s, %s, %s, %s, %s)'] * len(neutral_items_data))
            query = f"""
                INSERT INTO neutrals (build_id, tier, item, wins, matches)
                VALUES {placeholders}
                ON CONFLICT (build_id, item)
                DO UPDATE SET wins = neutrals.wins + EXCLUDED.wins, matches = neutrals.matches + EXCLUDED.matches
            """
            params = [item for sublist in neutral_items_data for item in sublist]
            cur.execute(query, params)
            neutral_items_data = []
            print("Neutral Data Complete")
        
    print("Done. Last sequence num: ", seq_num)
    with open(file_path, 'w') as file:
        json.dump({"seq_num": seq_num}, file)
    conn.commit()
    conn.close()

    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"That took {round((elapsed_time/60), 2)} minutes")
    
# file_path = '/home/ec2-user/dotam/python/daily/seq_num.json'
file_path = './python/daily/seq_num.json'

with open(file_path, 'r') as file:
    data = json.load(file)
    seq_num = data['seq_num']

# facet_path = '/home/ec2-user/dotam/python/daily/facet_nums.json'
facet_path = './python/daily/facet_nums.json'

with open(facet_path, 'r') as file:
    facet_nums = json.load(file)

ranked_matches = []

hourlyDump = 0
builds = []

while True:
    # try:

    DOTA_2_URL = SEQ_URL + str(seq_num)

    response = requests.get(DOTA_2_URL, timeout=600)

    if response.status_code == 200:
        matches = response.json()['result']['matches']
        for match in matches:
            seq_num = match['match_seq_num']
            if match['lobby_type'] == 7 and match['game_mode'] == 22:
                ranked_match = {}
                radiantWon = match['radiant_win']
                ranked_match['match_id'] = match['match_id']
                players = match['players']
                i = 0
                playersInfo = []
                for player in players:
                    won = 0
                    if i < 5 and radiantWon:
                        won = 1
                    elif i > 4 and not radiantWon:
                        won = 1
                    i += 1
                    heroObj = {}
                    heroObj['id'] = player['hero_id']
                    heroObj['facet'] = player['hero_variant']
                    heroObj['won'] = won
                    playersInfo.append(heroObj)
                ranked_match['players'] = playersInfo
                ranked_matches.append(ranked_match)
                if len(ranked_matches) == 25:
                    hourlyDump += 1
                    print(hourlyDump)
                    builds = getBuilds(ranked_matches, builds)
                    ranked_matches = []
    else:
        seq_num += 1

    if hourlyDump >= 200:
        print("Sucessfully parsed data!")
        sendtosql(builds)
        break
    
    # except Exception as e:
    #     print("Error: ", e)
    #     # sendtosql(builds)
    #     break