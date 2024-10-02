#!/usr/bin/env python3

import time
import psycopg2
import json
import requests
import os
import psutil

from dotenv import load_dotenv

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
# patch = '7.37d'
table = 'p7_37c'

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
                    for earlitem in purchasedItems:
                        item_id = earlitem['itemId']
                        if earlitem['time'] < 900 and item_id in Early:
                            secondPurchase = False
                            if item_id in tempItemArray:
                                secondPurchase = True
                            tempItemArray.append(item_id)
                            earlyItems.append({'Item': item_id, 'isSecondPurchase': secondPurchase})

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
                        break
                    
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
                                hero_build[8].append({'Starting': startingItems, 'Wins': win, 'Matches': 1})

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
                                                for lateItem in build['Late'][str(m)]:
                                                    if gameItem == lateItem['Item']:
                                                        lateItem['Wins'] += win
                                                        lateItem['Matches'] += 1
                                                        lateFound = True
                                                        break
                                                if not lateFound:
                                                    build['Late'][str(m)].append({'Item': gameItem, 'Wins': win, 'Matches': 1})
                                                m += 1
                                    buildFound = True
                                    break
                            if not buildFound:
                                lateGameItems = {}
                                m = 3 if isSupport else 4
                                for _ in range(7):
                                    if itemBuild:
                                        gameItem = itemBuild.pop(0)
                                        lateGameItems[str(m)] = [{'Item': gameItem, 'Wins': win, 'Matches': 1}]
                                    else:
                                        lateGameItems[str(m)] = []
                                    m += 1
                                hero_build[10].append({'Core': core, 'Wins': win, 'Matches': 1, 'Late': lateGameItems})
                            
                            break
                    if not (rankBuildFound and lmhBuildFound and allBuildFound):
                        finalTalents = []
                        for finalTalent in talents:
                            finalTalents.append({'Talent': finalTalent, 'Wins': win, 'Matches': 1})
                        finalEarlyItems = []
                        for tempEarlyItem in earlyItems:
                            finalEarlyItems.append({'Item': tempEarlyItem['Item'], 'isSecondPurchase': tempEarlyItem['isSecondPurchase'], 'Wins': win, 'Matches': 1})
                        finalCoreItems = []
                        lateGameItems = {}
                        m = 3 if isSupport else 4
                        for _ in range(7):
                            if itemBuild:
                                gameItem = itemBuild.pop(0)
                                lateGameItems[str(m)] = [{'Item': gameItem, 'Wins': win, 'Matches': 1}]
                            else:
                                lateGameItems[str(m)] = []
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

file_path = './python/daily/seq_num.json'

with open(file_path, 'r') as file:
    data = json.load(file)
    seq_num = data['seq_num']

ranked_matches = []

# process = psutil.Process()
# mem_info = process.memory_info()
# print(f"Resident Set Size: {mem_info.rss / 1024 ** 2:.2f} MB")
# print(f"Virtual Memory Size: {mem_info.vms / 1024 ** 2:.2f} MB")

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

    # Merging two arrays together one hero at a time. Hopefully reducing the size of the memory

    if hourlyDump >= 800:
        print("Dumping stuff. Last sequence num is ", seq_num)
        
        for build in builds:
            hero_id = build[0]
            rank = build[1]
            role = build[2]
            facet = build[3]
            total_matches = build[4]
            total_wins = build[5]
            abilities = json.dumps(build[6])
            talents = json.dumps(build[7])
            starting_items = json.dumps(build[8])
            early_items = json.dumps(build[9])
            core_items = json.dumps(build[10])

            # SQL Query
            sql = """
            WITH existing_build AS (
                SELECT abilities, talents, starting, early, core
                FROM {table}
                WHERE hero_id = %s AND rank = %s AND role = %s AND facet = %s
            ),
            updated_abilities AS (
                SELECT CASE
                    WHEN abilities IS NOT NULL THEN (
                        SELECT jsonb_agg(
                            CASE
                                WHEN ability_obj->>'Abilities' = %s THEN
                                    jsonb_set(
                                        ability_obj, 
                                        '{Matches}', ((ability_obj->>'Matches')::int + %s)::text::jsonb,
                                        '{Wins}', ((ability_obj->>'Wins')::int + %s)::text::jsonb
                                    )
                                ELSE ability_obj
                            END
                        )
                        FROM jsonb_each(abilities) AS ability_obj
                    )
                    ELSE
                        jsonb_build_array(jsonb_build_object('Abilities', %s, 'Matches', %s, 'Wins', %s))
                END AS new_abilities
            ),
            updated_talents AS (
                SELECT CASE
                    WHEN talents @> %s THEN
                        jsonb_set(talents, '{Talents}', 
                            jsonb_agg(
                                jsonb_build_object(
                                    'Talent', coalesce(talents->'Talent', '[]'::jsonb), 
                                    'Matches', (coalesce(talents->'Matches', '0')::int + %s),
                                    'Wins', (coalesce(talents->'Wins', '0')::int + %s)
                                )
                            )
                        )
                    ELSE
                        jsonb_insert(
                            talents, '{Talents}', 
                            jsonb_build_object('Talent', %s, 'Matches', 1, 'Wins', %s)
                        )
                    END AS new_talents
                FROM existing_build
            ),
            updated_starting AS (
                SELECT CASE
                    WHEN starting @> %s THEN
                        jsonb_set(starting, '{Starting}', 
                            jsonb_agg(
                                jsonb_build_object(
                                    'Starting', coalesce(starting->'Starting', '[]'::jsonb), 
                                    'Matches', (coalesce(starting->'Matches', '0')::int + %s),
                                    'Wins', (coalesce(starting->'Wins', '0')::int + %s)
                                )
                            )
                        )
                    ELSE
                        jsonb_insert(
                            starting, '{Starting}', 
                            jsonb_build_object('Starting', %s, 'Matches', 1, 'Wins', %s)
                        )
                    END AS new_starting
                FROM existing_build
            ),
            updated_early AS (
                SELECT CASE
                    WHEN early @> %s THEN
                        jsonb_set(early, '{Early}', 
                            jsonb_agg(
                                jsonb_build_object(
                                    'Item', coalesce(early->'Item', '[]'::jsonb), 
                                    'Matches', (coalesce(early->'Matches', '0')::int + %s),
                                    'Wins', (coalesce(early->'Wins', '0')::int + %s)
                                )
                            )
                        )
                    ELSE
                        jsonb_insert(
                            early, '{Early}', 
                            jsonb_build_object('Item', %s, 'Matches', 1, 'Wins', %s)
                        )
                    END AS new_early
                FROM existing_build
            ),
            updated_core AS (
                SELECT CASE
                    WHEN core @> %s THEN
                        jsonb_set(core, '{Core}', 
                            jsonb_agg(
                                jsonb_build_object(
                                    'Core', coalesce(core->'Core', '[]'::jsonb), 
                                    'Matches', (coalesce(core->'Matches', '0')::int + %s),
                                    'Wins', (coalesce(core->'Wins', '0')::int + %s)
                                )
                            )
                        )
                    ELSE
                        jsonb_insert(
                            core, '{Core}', 
                            jsonb_build_object('Core', %s, 'Matches', 1, 'Wins', %s)
                        )
                    END AS new_core
                FROM existing_build
            )
            UPDATE {table}
            SET abilities = updated_abilities.new_abilities,
                talents = updated_talents.new_talents,
                starting = updated_starting.new_starting,
                early = updated_early.new_early,
                core = updated_core.new_core,
                total_matches = total_matches + %s,   -- Increment total_matches
                total_wins = total_wins + %s           -- Increment total_wins
            FROM updated_abilities, updated_talents, updated_starting, updated_early, updated_core
            WHERE hero_id = %s AND rank = %s AND role = %s AND facet = %s;
            """

            # Execute the SQL query
            cur.execute(sql, (
                hero_id, rank, role, facet,           # For checking existing build
                abilities, total_matches, total_wins, abilities, total_wins,  # Abilities data
                talents, total_matches, total_wins, talents, total_wins,      # Talents data
                starting_items, total_matches, total_wins, starting_items, total_wins, # Starting items
                early_items, total_matches, total_wins, early_items, total_wins,       # Early items
                core_items, total_matches, total_wins, core_items, total_wins,         # Core items
                total_matches, total_wins,           # Increment total_matches and total_wins
                hero_id, rank, role, facet           # Final WHERE clause
            ))

            conn.commit()
        
        print("Done. Last sequence num: ", seq_num)
        with open(file_path, 'w') as file:
            json.dump({"seq_num": seq_num}, file)
        dump = False
        conn.close()
        break