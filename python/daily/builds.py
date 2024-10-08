#!/usr/bin/env python3

import time
import psycopg2
import json
import requests
import os
import psutil

from dotenv import load_dotenv
from collections import Counter

# UPDATES
# Starting Items - Forgot to make sure they are sorted when comparing them


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

conn = psycopg2.connect(builds_database_url)
cur = conn.cursor()

res = requests.get("https://dhpoqm1ofsbx7.cloudfront.net/patch.txt")
patch = res.text

def actualRank(rank):
    if rank >= 80:
        return ["IMMORTAL", "HIGH"]
    elif rank >= 70:
        return ["DIVINE", "HIGH"]
    elif rank >= 60:
        return ["ANCIENT", "MID"]
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
    stratz_headers = {'Authorization': f'Bearer {graphql_token}'}

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
        gqlmatch = data['data']['match_' + str(match_id)]
        if gqlmatch:
            rank = actualRank(gqlmatch['actualRank'])
            players = gqlmatch['players']
            for n, player in enumerate(players):
                purchasedItems = player['stats']['itemPurchases']
                if purchasedItems:
                    hero_id = ranked_match['players'][n]['id']
                    role = player['position']
                    facet = ranked_match['players'][n]['facet']
                    win = ranked_match['players'][n]['won']

                    if facet in facet_nums[str(hero_id)]:
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
                            
                            if core:
                                rankBuildFound = False # Specific Rank Build
                                lmhBuildFound = False # Low Mid High Build
                                allBuildFound = False # "" Build
                                for hero_build in builds:
                                    if hero_build[0] == hero_id and (hero_build[1] == rank[0] or hero_build[1] == rank[1] or hero_build[1] == "") and hero_build[2] == role and hero_build[3] == facet:
                                        
                                        if hero_build[1] == rank[0]:
                                            rankBuildFound = True
                                        if hero_build[1] == rank[1]:
                                            lmhBuildFound = True
                                        if hero_build[1] == "":
                                            allBuildFound = True
                                        
                                        hero_build[4] += 1 # Matches increased
                                        hero_build[5] += win

                                        abilitiesFound = False
                                        for abilityBuild in hero_build[6]:
                                            if abilityBuild['Abilities'] == abilities:
                                                abilityBuild['Wins'] += win
                                                abilityBuild['Matches'] += 1
                                                abilitiesFound = True
                                                break
                                        if not abilitiesFound:
                                            hero_build[6].append({'Abilities': abilities, 'Wins': win, 'Matches': 1})
                                        
                                        for talent in talents:
                                            talentFound = False
                                            for talentBuild in hero_build[7]:
                                                if talentBuild['Talent'] == talent:
                                                    talentBuild['Wins'] += win
                                                    talentBuild['Matches'] += 1
                                                    talentFound = True
                                                    break
                                            if not talentFound:
                                                hero_build[7].append({'Talent': talent, 'Wins': win, 'Matches': 1})

                                        startingFound = False
                                        for startingBuild in hero_build[8]:
                                            if sorted(startingBuild['Starting']) == sorted(startingItems):
                                                startingBuild['Wins'] += win
                                                startingBuild['Matches'] += 1
                                                startingFound = True
                                                break
                                        if not startingFound:
                                            hero_build[8].append({'Starting': sorted(startingItems), 'Wins': win, 'Matches': 1})

                                        for earlyGameItem in earlyItems:
                                            earlyFound = False
                                            for earlyItem in hero_build[9]:
                                                if earlyItem['Item'] == earlyGameItem['Item'] and earlyItem['isSecondPurchase'] == earlyGameItem['isSecondPurchase']:
                                                    earlyItem['Matches'] += 1
                                                    earlyItem['Wins'] += win
                                                    earlyFound = True
                                                    break
                                            if not earlyFound:
                                                hero_build[9].append({'Item': earlyGameItem['Item'], 'isSecondPurchase': earlyGameItem['isSecondPurchase'], 'Wins': win, 'Matches': 1})

                                        buildFound = False
                                        for build in hero_build[10]:
                                            if build['Core'] == core:
                                                build['Wins'] += win
                                                build['Matches'] += 1
                                                m = 3 if isSupport else 4
                                                if m < (m+7):
                                                    for index, gameItem in enumerate(itemBuild[m:], start=m):
                                                        if index < 7:
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

                                    if not rankBuildFound:
                                        tempBuild = [hero_id, rank[0], role, facet, 1, win, 
                                                    [{'Abilities': abilities, 'Wins': win, 'Matches': 1}], finalTalents, 
                                                    [{'Starting': startingItems, 'Wins': win, 'Matches': 1}], finalEarlyItems,
                                                    finalCoreItems]
                                        builds.append(tempBuild)
                                    if not lmhBuildFound:
                                        tempBuild = [hero_id, rank[1], role, facet, 1, win, 
                                                    [{'Abilities': abilities, 'Wins': win, 'Matches': 1}], finalTalents, 
                                                    [{'Starting': startingItems, 'Wins': win, 'Matches': 1}], finalEarlyItems,
                                                    finalCoreItems]
                                        builds.append(tempBuild)
                                    if not allBuildFound:
                                        tempBuild = [hero_id, "", role, facet, 1, win, 
                                                    [{'Abilities': abilities, 'Wins': win, 'Matches': 1}], finalTalents, 
                                                    [{'Starting': startingItems, 'Wins': win, 'Matches': 1}], finalEarlyItems,
                                                    finalCoreItems]
                                        builds.append(tempBuild)
    return builds

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

    if hourlyDump >= 50:

        testBuilds = sorted(builds, key=lambda build: build[4], reverse=True)
        testBuild = testBuilds[0]
        print("Total matches: ", testBuild[4])
        print("Total wins: ", testBuild[5])
        print("Talents: ", testBuild[7])
        break

        BATCH_SIZE = 15000

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

        for build in builds:
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
        
        print("Done. Last sequence num: ", seq_num)
        with open(file_path, 'w') as file:
            json.dump({"seq_num": seq_num}, file)
        conn.commit()
        conn.close()
        break