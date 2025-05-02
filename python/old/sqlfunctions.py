import time
import psycopg2
import json
import requests
import os
import psutil
import copy
import traceback

from datetime import datetime
from dotenv import load_dotenv
from collections import Counter


def execute_postgres(cur, query, params, timeout, doReturn, type):

    # cur.execute(f"SET statement_timeout = '{timeout}s'")
    retries = 3

    for attempt in range(retries):
        try:
            if params:
                cur.execute(query, params)
            else:
                cur.execute(query)
            
            if doReturn:
                return cur.fetchall()
        except psycopg2.OperationalError as e:
            print(f"OperationalError on attempt {attempt + 1}: {e}")
            if attempt < retries - 1:
                time.sleep(5)
            else:
                print("Third time wasn't the charm. Failed on this query: ", query)
        
        except psycopg2.Error as e:

            print(f"Error: {e}")
            
            # if type == "talents":
            #     unique_pairs = []
            #     new_params = []
            #     for i in range(0, len(params), 4):
            #         pair = [params[i], params[i+1]]
            #         if pair not in unique_pairs:
            #             unique_pairs.append(pair)
            #             new_params.extend([params[i], params[i+1], params[i+2], params[i+3]])
            #         else:
            #             print(pair)
            #     cur.execute(query, new_params)
            break
       
def sendtosql(builds):

    builds_database_url = os.environ.get('BUILDS_DATABASE_URL')
    conn = psycopg2.connect(builds_database_url, connect_timeout=600)
    cur = conn.cursor()

    BATCH_SIZE = 10000
    ITEMS_BATCH = 2500
    ABILITIES_BATCH = 1000

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

    build_ids = []

    print("Grabbing build ids")

    for build in builds:
        hero_id = build[0]
        rank = build[1]
        role = build[2]
        facet = build[3]
        unique_identifiers.append((hero_id, rank, role, facet, patch))

    placeholders = ', '.join(['(%s, %s, %s, %s, %s)']*len(unique_identifiers))
    params = [item for sublist in unique_identifiers for item in sublist]
    main_query = f"""
        SELECT * FROM main 
        WHERE (hero_id, rank, role, facet, patch) IN ({placeholders})
    """
    build_ids.extend(execute_postgres(cur, main_query, params, 120, True, "main"))

    # print(len(build_ids), len(unique_identifiers))
    m = len(builds)
    n = 0

    for build in builds:
        m -= 1
        if n > 1000:
            n = 0
            conn.commit()
            conn.close()
            time.sleep(30)
            conn = psycopg2.connect(builds_database_url, connect_timeout=600)
            cur = conn.cursor()
        else:
            n += 1
        build_id = None
        for row in build_ids:
            if (row[1], row[2], row[3], row[4], row[5]) == (build[0], patch, build[1], build[2], build[3]):
                build_id = row[0]
        total_matches = build[4]
        total_wins = build[5]
        abilities = build[6]
        talents = build[7]
        starting_items = build[8]
        early_items = build[9]
        core_items = build[10]
        neutral_items = build[11]

        # if build_id == 5930 or build_id == 5990:
        #     print(build)

        # print(build[0], build[1], build[2], build[3], patch, build_id)

        total_data.append((build_id, total_matches, total_wins))
        abilities_data.extend([
            (build_id, *abi['Abilities'], abi['Wins'], abi['Matches']) 
            for abi in abilities
        ])
        talents_data.extend([
            (build_id, talent['Talent'], talent['Wins'], talent['Matches']) 
            for talent in talents
        ])
        starting_items_data.extend([
            (build_id, *sorted(start['Starting']) + [None] * (6 - len(start['Starting'])), start['Wins'], start['Matches']) 
            for start in starting_items
        ])
        early_items_data.extend([
            (build_id, early['Item'], early['isSecondPurchase'], early['Wins'], early['Matches']) 
            for early in early_items
        ])

        for core in core_items:
            core_1 = core['Core'][0]
            core_2 = core['Core'][1]
            core_3 = None
            if len(core['Core']) > 2:
                core_3 = core['Core'][2]
            core_items_data.append((build_id, core_1, core_2, core_3, core['Wins'], core['Matches']))
            late_items_data.extend([
                (build_id, core_1, core_2, core_3, late['Nth'], late['Item'], late['Wins'], late['Matches'])
                for late in core['Late']
            ])
        
        neutral_items_data.extend([
            (build_id, neutral['Tier'], neutral['Item'], neutral['Wins'], neutral['Matches'])
            for neutral in neutral_items
        ])

        # Total Matches and Wins
        if len(total_data) >= BATCH_SIZE:
            print("Batched total matches - ", m)
            placeholders = ', '.join(['(%s, %s, %s)'] * len(total_data))
            query = f"""
                INSERT INTO main (build_id, total_matches, total_wins)
                VALUES {placeholders}
                ON CONFLICT (build_id)
                DO UPDATE SET total_matches = main.total_matches + EXCLUDED.total_matches, total_wins = main.total_wins + EXCLUDED.total_wins
            """
            params = [item for sublist in total_data for item in sublist]
            execute_postgres(cur, query, params, 30, False, "total")
            total_data = []

        # Abilities
        if len(abilities_data) >= ABILITIES_BATCH:
            print("Batched abilities - ", m)
            placeholders = ', '.join(['(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'] * len(abilities_data))
            query = f"""
                INSERT INTO abilities (build_id, ability_1, ability_2, ability_3, ability_4, ability_5, ability_6, ability_7, ability_8, ability_9, ability_10, ability_11, ability_12, ability_13, ability_14, ability_15, ability_16, wins, matches)
                VALUES {placeholders}
                ON CONFLICT (build_id, ability_1, ability_2, ability_3, ability_4, ability_5, ability_6, ability_7, ability_8, ability_9, ability_10, ability_11, ability_12, ability_13, ability_14, ability_15, ability_16)
                DO UPDATE SET wins = abilities.wins + EXCLUDED.wins, matches = abilities.matches + EXCLUDED.matches
            """
            params = [item for sublist in abilities_data for item in sublist]
            execute_postgres(cur, query, params, 30, False, "abilities")
            abilities_data = []

        # Talents
        if len(talents_data) >= BATCH_SIZE:
            print("Batched talents - ", m)
            placeholders = ', '.join(['(%s, %s, %s, %s)'] * len(talents_data))
            query = f"""
                INSERT INTO talents (build_id, talent, wins, matches)
                VALUES {placeholders}
                ON CONFLICT (build_id, talent)
                DO UPDATE SET wins = talents.wins + EXCLUDED.wins, matches = talents.matches + EXCLUDED.matches
            """
            params = [item for sublist in talents_data for item in sublist]
            execute_postgres(cur, query, params, 30, False, "talents")
            talents_data = []
        
        # Starting 
        if len(starting_items_data) >= ITEMS_BATCH:
            print("Batched starting - ", m)
            placeholders = ', '.join(['(%s, %s, %s, %s, %s, %s, %s, %s, %s)'] * len(starting_items_data))
            query = f"""
                INSERT INTO starting (build_id, starting_1, starting_2, starting_3, starting_4, starting_5, starting_6, wins, matches)
                VALUES {placeholders}
                ON CONFLICT (build_id, starting_1, starting_2, starting_3, starting_4, starting_5, starting_6)
                DO UPDATE SET wins = starting.wins + EXCLUDED.wins, matches = starting.matches + EXCLUDED.matches
            """
            params = [item for sublist in starting_items_data for item in sublist]
            execute_postgres(cur, query, params, 30, False, "starting")
            starting_items_data = []

        # Early 
        if len(early_items_data) >= ITEMS_BATCH:
            print("Batched early - ", m)
            placeholders = ', '.join(['(%s, %s, %s, %s, %s)'] * len(early_items_data))
            query = f"""
                INSERT INTO early (build_id, item, secondpurchase, wins, matches)
                VALUES {placeholders}
                ON CONFLICT (build_id, item, secondpurchase)
                DO UPDATE SET wins = early.wins + EXCLUDED.wins, matches = early.matches + EXCLUDED.matches
            """
            params = [item for sublist in early_items_data for item in sublist]
            execute_postgres(cur, query, params, 30, False, "early")
            early_items_data = []
        
        # Core
        if len(core_items_data) >= ITEMS_BATCH:
            print("Batched core - ", m)

            carry = [item for item in core_items_data if item[3] is not None]
            support = [item for item in core_items_data if item[3] is None]

            if carry:
                carry_core_placeholders = ', '.join(['(%s, %s, %s, %s, %s, %s)'] * len(carry))
                carry_core_query = f"""
                    INSERT INTO core (build_id, core_1, core_2, core_3, wins, matches)
                    VALUES {carry_core_placeholders}
                    ON CONFLICT (build_id, core_1, core_2, core_3)
                    DO UPDATE SET wins = core.wins + EXCLUDED.wins, matches = core.matches + EXCLUDED.matches
                """
                carry_core_params = [item for sublist in carry for item in sublist]
                execute_postgres(cur, carry_core_query, carry_core_params, 120, False, "core")

            if support:
                support_core_placeholders = ', '.join(['(%s, %s, %s, %s, %s)'] * len(support))
                support_core_query = f"""
                    INSERT INTO core (build_id, core_1, core_2, wins, matches)
                    VALUES {support_core_placeholders}
                    ON CONFLICT (build_id, core_1, core_2)
                    WHERE core_3 IS NULL
                    DO UPDATE SET wins = core.wins + EXCLUDED.wins, matches = core.matches + EXCLUDED.matches
                """
                support_core_params = []
                for sublist in support:
                    build_id, core_1, core_2, _, wins, matches = sublist  # Skip core_3
                    support_core_params.extend([build_id, core_1, core_2, wins, matches])
                execute_postgres(cur, support_core_query, support_core_params, 120, False, "core")

            core_items_data = [] 
            carry = []
            support = []

        # Late
        if len(late_items_data) >= ITEMS_BATCH:
            print("Batched late - ", m)
            carry = [item for item in late_items_data if item[3] is not None]
            support = [item for item in late_items_data if item[3] is None]

            if carry:
                carry_late_placeholders = ', '.join(['(%s, %s, %s, %s, %s, %s, %s, %s)'] * len(carry))
                carry_late_query = f"""
                    INSERT INTO late (build_id, core_1, core_2, core_3, nth, item, wins, matches)
                    VALUES {carry_late_placeholders}
                    ON CONFLICT (build_id, core_1, core_2, core_3, nth, item)
                    DO UPDATE SET wins = late.wins + EXCLUDED.wins, matches = late.matches + EXCLUDED.matches
                """
                carry_late_params = [item for sublist in carry for item in sublist]
                execute_postgres(cur, carry_late_query, carry_late_params, 180, False, "late")
            
            if support:
                support_late_placeholders = ', '.join(['(%s, %s, %s, %s, %s, %s, %s)'] * len(support))
                support_late_query = f"""
                    INSERT INTO late (build_id, core_1, core_2, nth, item, wins, matches)
                    VALUES {support_late_placeholders}
                    ON CONFLICT (build_id, core_1, core_2, nth, item)
                    WHERE core_3 IS NULL
                    DO UPDATE SET wins = late.wins + EXCLUDED.wins, matches = late.matches + EXCLUDED.matches
                """
                support_late_params = []
                for sublist in support:
                    build_id, core_1, core_2, core_3, nth, item, wins, matches = sublist  # Skip core_3
                    support_late_params.extend([build_id, core_1, core_2, nth, item, wins, matches])
                execute_postgres(cur, support_late_query, support_late_params, 180, False, "late")
            
            late_items_data = []
            carry = []
            support = []
        
        # Neutrals
        if len(neutral_items_data) >= ITEMS_BATCH:
            print("Batched neutrals - ", m)
            placeholders = ', '.join(['(%s, %s, %s, %s, %s)'] * len(neutral_items_data))
            query = f"""
                INSERT INTO neutrals (build_id, tier, item, wins, matches)
                VALUES {placeholders}
                ON CONFLICT (build_id, tier, item)
                DO UPDATE SET wins = neutrals.wins + EXCLUDED.wins, matches = neutrals.matches + EXCLUDED.matches
            """
            params = [item for sublist in neutral_items_data for item in sublist]
            execute_postgres(cur, query, params, 30, False, "neutrals")
            neutral_items_data = []
            

    # IF WE HAVE LEFT OVER DATA
    print("Finished looping through builds, dumping rest")
    # Total Matches and Wins
    if total_data:
        print("Batched total matches")
        placeholders = ', '.join(['(%s, %s, %s)'] * len(total_data))
        query = f"""
            INSERT INTO main (build_id, total_matches, total_wins)
            VALUES {placeholders}
            ON CONFLICT (build_id)
            DO UPDATE SET total_matches = main.total_matches + EXCLUDED.total_matches, total_wins = main.total_wins + EXCLUDED.total_wins
        """
        params = [item for sublist in total_data for item in sublist]
        execute_postgres(cur, query, params, 30, False, "total")
        total_data = []

    # Abilities
    if abilities_data:
        print("Batched abilities")
        placeholders = ', '.join(['(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'] * len(abilities_data))
        query = f"""
            INSERT INTO abilities (build_id, ability_1, ability_2, ability_3, ability_4, ability_5, ability_6, ability_7, ability_8, ability_9, ability_10, ability_11, ability_12, ability_13, ability_14, ability_15, ability_16, wins, matches)
            VALUES {placeholders}
            ON CONFLICT (build_id, ability_1, ability_2, ability_3, ability_4, ability_5, ability_6, ability_7, ability_8, ability_9, ability_10, ability_11, ability_12, ability_13, ability_14, ability_15, ability_16)
            DO UPDATE SET wins = abilities.wins + EXCLUDED.wins, matches = abilities.matches + EXCLUDED.matches
        """
        params = [item for sublist in abilities_data for item in sublist]
        execute_postgres(cur, query, params, 30, False, "abilities")
        abilities_data = []

    # Talents
    if talents_data:
        print("Batched talents")
        placeholders = ', '.join(['(%s, %s, %s, %s)'] * len(talents_data))
        query = f"""
            INSERT INTO talents (build_id, talent, wins, matches)
            VALUES {placeholders}
            ON CONFLICT (build_id, talent)
            DO UPDATE SET wins = talents.wins + EXCLUDED.wins, matches = talents.matches + EXCLUDED.matches
        """
        params = [item for sublist in talents_data for item in sublist]
        execute_postgres(cur, query, params, 30, False, "talents")
        talents_data = []
    
    # Starting 
    if starting_items_data:
        print("Batched starting")
        placeholders = ', '.join(['(%s, %s, %s, %s, %s, %s, %s, %s, %s)'] * len(starting_items_data))
        query = f"""
            INSERT INTO starting (build_id, starting_1, starting_2, starting_3, starting_4, starting_5, starting_6, wins, matches)
            VALUES {placeholders}
            ON CONFLICT (build_id, starting_1, starting_2, starting_3, starting_4, starting_5, starting_6)
            DO UPDATE SET wins = starting.wins + EXCLUDED.wins, matches = starting.matches + EXCLUDED.matches
        """
        params = [item for sublist in starting_items_data for item in sublist]
        execute_postgres(cur, query, params, 30, False, "starting")
        starting_items_data = []

    # Early 
    if early_items_data:
        print("Batched early")
        placeholders = ', '.join(['(%s, %s, %s, %s, %s)'] * len(early_items_data))
        query = f"""
            INSERT INTO early (build_id, item, secondpurchase, wins, matches)
            VALUES {placeholders}
            ON CONFLICT (build_id, item, secondpurchase)
            DO UPDATE SET wins = early.wins + EXCLUDED.wins, matches = early.matches + EXCLUDED.matches
        """
        params = [item for sublist in early_items_data for item in sublist]
        execute_postgres(cur, query, params, 30, False, "early")
        early_items_data = []
    
    # Core
    if core_items_data:
        print("Batched core")

        carry = [item for item in core_items_data if item[3] is not None]
        support = [item for item in core_items_data if item[3] is None]

        if carry:
            carry_core_placeholders = ', '.join(['(%s, %s, %s, %s, %s, %s)'] * len(carry))
            carry_core_query = f"""
                INSERT INTO core (build_id, core_1, core_2, core_3, wins, matches)
                VALUES {carry_core_placeholders}
                ON CONFLICT (build_id, core_1, core_2, core_3)
                DO UPDATE SET wins = core.wins + EXCLUDED.wins, matches = core.matches + EXCLUDED.matches
            """
            carry_core_params = [item for sublist in carry for item in sublist]
            execute_postgres(cur, carry_core_query, carry_core_params, 120, False, "core")

        if support:
            support_core_placeholders = ', '.join(['(%s, %s, %s, %s, %s)'] * len(support))
            support_core_query = f"""
                INSERT INTO core (build_id, core_1, core_2, wins, matches)
                VALUES {support_core_placeholders}
                ON CONFLICT (build_id, core_1, core_2)
                WHERE core_3 IS NULL
                DO UPDATE SET wins = core.wins + EXCLUDED.wins, matches = core.matches + EXCLUDED.matches
            """
            support_core_params = []
            for sublist in support:
                build_id, core_1, core_2, _, wins, matches = sublist  # Skip core_3
                support_core_params.extend([build_id, core_1, core_2, wins, matches])
            execute_postgres(cur, support_core_query, support_core_params, 120, False, "core")

        core_items_data = [] 
        core = []
        support = []

    # Late
    if late_items_data:
        print("Batched late")

        carry = [item for item in late_items_data if item[3] is not None]
        support = [item for item in late_items_data if item[3] is None]

        if carry:
            carry_late_placeholders = ', '.join(['(%s, %s, %s, %s, %s, %s, %s, %s)'] * len(carry))
            carry_late_query = f"""
                INSERT INTO late (build_id, core_1, core_2, core_3, nth, item, wins, matches)
                VALUES {carry_late_placeholders}
                ON CONFLICT (build_id, core_1, core_2, core_3, nth, item)
                DO UPDATE SET wins = late.wins + EXCLUDED.wins, matches = late.matches + EXCLUDED.matches
            """
            carry_late_params = [item for sublist in carry for item in sublist]
            execute_postgres(cur, carry_late_query, carry_late_params, 180, False, "late")
        
        if support:
            support_late_placeholders = ', '.join(['(%s, %s, %s, %s, %s, %s, %s)'] * len(support))
            support_late_query = f"""
                INSERT INTO late (build_id, core_1, core_2, nth, item, wins, matches)
                VALUES {support_late_placeholders}
                ON CONFLICT (build_id, core_1, core_2, nth, item)
                WHERE core_3 IS NULL
                DO UPDATE SET wins = late.wins + EXCLUDED.wins, matches = late.matches + EXCLUDED.matches
            """
            support_late_params = []
            for sublist in support:
                build_id, core_1, core_2, _, nth, item, wins, matches = sublist  # Skip core_3
                support_late_params.extend([build_id, core_1, core_2, nth, item, wins, matches])
            execute_postgres(cur, support_late_query, support_late_params, 180, False, "late")
        
        late_items_data = []
        core = []
        support = []
    
    # Neutrals
    if neutral_items_data:
        print("Batched neutrals")
        placeholders = ', '.join(['(%s, %s, %s, %s, %s)'] * len(neutral_items_data))
        query = f"""
            INSERT INTO neutrals (build_id, tier, item, wins, matches)
            VALUES {placeholders}
            ON CONFLICT (build_id, tier, item)
            DO UPDATE SET wins = neutrals.wins + EXCLUDED.wins, matches = neutrals.matches + EXCLUDED.matches
        """
        params = [item for sublist in neutral_items_data for item in sublist]
        execute_postgres(cur, query, params, 30, False, "neutrals")
        neutral_items_data = []
        
    print("Done. Last sequence num: ", seq_num)
    with open(file_path, 'w') as file:
        json.dump({"seq_num": seq_num}, file)
    conn.commit()
    conn.close()

    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"That took {round((elapsed_time/60), 2)} minutes")

def savebuilds(builds):
    build_file = f"./python/build_data/test/builds.json"
    directory_path = f"./python/build_data/test"
    os.makedirs(directory_path, exist_ok=True)
    with open(build_file, 'w') as file:
        json.dump(builds, file, indent=2)
