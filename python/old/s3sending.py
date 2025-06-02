def mergebuilds(existing: dict, new: dict):
    for key, value in new.items():
        if key in existing:
            existing[key]['Wins'] += value['Wins']
            existing[key]['Matches'] += value['Matches']
        else:
            existing[key] = value.copy()
    return existing

def process_build(builds, hero_id, rank):
    
    global patch

    if not rank:
        rank = ""
    
    # Grabbing Summary for Wins and Matches
    s3_summary_key = f"data/{patch}/{hero_id}/{rank}/summary.json"
    summary_obj = s3.get_object(Bucket='dotam-builds', Key=s3_summary_key)
    s3_summary = json.loads(summary_obj['Body'].read().decode('utf-8'))

    # Grabbing Data
    s3_data_key = f"data/{patch}/{hero_id}/{rank}/data.json"
    data_obj = s3.get_object(Bucket='dotam-builds', Key=s3_data_key)
    existing_data = json.loads(data_obj['Body'].read().decode('utf-8'))

    # Grabbing Abilities Page Info
    s3_abilities_key = f"data/{patch}/{hero_id}/{rank}/abilities.json"
    abilities_obj = s3.get_object(Bucket='dotam-builds', Key=s3_abilities_key)
    existing_abilities = json.loads(abilities_obj['Body'].read().decode('utf-8'))

    # Grabbing Items Page Info
    s3_items_key = f"data/{patch}/{hero_id}/{rank}/items.json"
    items_obj = s3.get_object(Bucket='dotam-builds', Key=s3_items_key)
    existing_items = json.loads(items_obj['Body'].read().decode('utf-8'))
    
    # Grabbing Build Page Info
    s3_builds_key = f"data/{patch}/{hero_id}/{rank}/builds.json"
    build_obj = s3.get_object(Bucket='dotam-builds', Key=s3_builds_key)
    existing_builds = json.loads(build_obj['Body'].read().decode('utf-8'))


    for build in builds:

        hero_id, rank, role, facet, total_matches, total_wins, abilities, talents, starting, early, core, neutrals = build

        if not rank:
            rank = ""
        
        lateStart = 4
        if role == "POSITION_4" or role == "POSITION_5":
            lateStart = 3

        s3_summary[role][str(facet)]["total_matches"] += total_matches
        s3_summary[role][str(facet)]["total_wins"] += total_wins
        
        new_build_data = [abilities, talents, starting, early, core, neutrals]

        existing_build_data = existing_data[role][str(facet)]

        if not existing_build_data:
            updated_abilities, updated_talents, updated_starting, updated_early, updated_core, updated_neutrals = new_build_data
            existing_data[role][str(facet)] = [updated_abilities, updated_talents, updated_starting, updated_early, updated_core, updated_neutrals]
        else:
            old_abilities, old_talents, old_starting, old_early, old_core, old_neutrals = existing_build_data

            abilities_dict = {tuple(d['Abilities']): {'Wins': d['Wins'], 'Matches': d['Matches']} for d in old_abilities}
            talents_dict = {d['Talent']: {'Wins': d['Wins'], 'Matches': d['Matches']} for d in old_talents}
            starting_dict = {tuple(d['Starting']): {'Wins': d['Wins'], 'Matches': d['Matches']} for d in old_starting}
            early_dict = {(d['Item'], d['isSecondPurchase']): {'Wins': d['Wins'], 'Matches': d['Matches']} for d in old_early}
            neutrals_dict = {d['Item']: {'Tier': d['Tier'], 'Wins': d['Wins'], 'Matches': d['Matches']} for d in old_neutrals}

            updated_abilities = mergebuilds(abilities_dict, abilities)
            updated_talents = mergebuilds(talents_dict, talents)
            updated_starting = mergebuilds(starting_dict, starting)
            updated_early = mergebuilds(early_dict, early)
            updated_neutrals = mergebuilds(neutrals_dict, neutrals)


            updated_core = {}
            for oc in old_core:
                old_late = {}
                for nth, items in oc["Late"].items():
                    for ol in items:
                        key = (ol['Item'], int(nth))
                        old_late[key] = {"Wins": ol["Wins"], "Matches": ol['Matches']}
                updated_core[tuple(oc["Core"])] = {
                    'Wins': oc["Wins"],
                    'Matches': oc['Matches'],
                    'Late': old_late
                }

            for key, value in core.items():
                if key not in updated_core:                    
                    updated_core[key] = {
                        'Wins': value['Wins'],
                        'Matches': value['Matches'],
                        'Late': dict(value.get('Late', {}))
                    }
                else:
                    updated_core[key]['Wins'] += value['Wins']
                    updated_core[key]['Matches'] += value['Matches']
                    
                    for (item_id, nth), stats in value.get('Late', {}).items():
                        late_key = (item_id, nth)
                        if late_key not in updated_core[key]['Late']:
                            updated_core[key]['Late'][late_key] = stats.copy()
                        else:
                            updated_core[key]['Late'][late_key]['Wins'] += stats['Wins']
                            updated_core[key]['Late'][late_key]['Matches'] += stats['Matches']
        
        
        # Organize Updated Builds for faster loading

        # Abilities Data
        top_abilities = sorted(updated_abilities.items(), key=lambda ta: (ta[1]["Matches"], ta[1]["Wins"]), reverse=True)
        abilities_json = [{'Abilities': list(k), **v} for k, v in top_abilities]
        talents_json = [{'Talent': k, **v} for k, v in updated_talents.items()]

        # Items Data
        top_starting = sorted(updated_starting.items(), key=lambda ts: (ts[1]["Matches"], ts[1]["Wins"]), reverse=True)
        top_early = sorted(updated_early.items(), key=lambda te: (te[1]["Matches"], te[1]["Wins"]), reverse=True)
        top_core = sorted(updated_core.items(), key=lambda tc: (tc[1]["Matches"], tc[1]["Wins"]), reverse=True)
        top_neutrals = sorted(updated_neutrals.items(), key=lambda tn: (tn[1]['Tier'], -tn[1]["Matches"], -tn[1]["Wins"]), reverse=False)
        
        
        for _, tc in top_core:
            grouped_by_nth = defaultdict(list)
            late_items = tc.get("Late", {})
            for (item_id, nth), stats in late_items.items():
                grouped_by_nth[nth].append({
                    'Item': item_id,
                    'Wins': stats['Wins'],
                    'Matches': stats['Matches']
                })
        
            for nth in grouped_by_nth:
                grouped_by_nth[nth].sort(key=lambda x: (x['Matches'], x['Wins']), reverse=True)
            
            tc["Late"] = dict(grouped_by_nth)
            


        starting_json = [{'Starting': list(k), **v} for k, v in top_starting]
        early_json = [
            {'Item': item_id, 'isSecondPurchase': is_second, 'Wins': stats['Wins'], 'Matches': stats['Matches']} 
            for (item_id, is_second), stats in top_early
                ]
        core_json = [{'Core': list(k), **v} for k, v in top_core]
        neutrals_json = [{'Item': k, **v} for k, v in top_neutrals]

        # Full Data, hopefully untouched when mutated later
        existing_data[role][str(facet)] = [abilities_json, talents_json, starting_json, early_json, core_json, neutrals_json]

        copied_core = copy.deepcopy(core_json[:10])

        for core_entry in copied_core:  # Only care about top 10 for items
            if "Late" in core_entry:
                for nth in core_entry["Late"]:
                    core_entry["Late"][nth] = core_entry["Late"][nth][:10]

        existing_abilities[role][str(facet)] = {
            "abilities": abilities_json[:10],
            "talents": talents_json
        }

        existing_items[role][str(facet)] = {
            "starting": starting_json[:5],
            "early": early_json[:10],
            "core": copied_core,
            "neutrals": neutrals_json
        }

        existing_builds[role][str(facet)] = {
            "abilities": abilities_json[0] if len(abilities_json) > 0 else None,
            "talents": talents_json,
            "items": {
                "starting": starting_json[0] if len(starting_json) > 0 else None,
                "early": early_json[:6] if len(early_json) > 0 else None,
                "core": copied_core[:3],
                "neutrals": neutrals_json
            }
        }  


    
    # Dumping Updated Summary
    s3.put_object(Bucket='dotam-builds', Key=s3_summary_key, Body=json.dumps(s3_summary, indent=None))    

    # Dumping Updated Build Data
    s3.put_object(Bucket='dotam-builds', Key=s3_data_key, Body=json.dumps(existing_data, indent=None))

    # Dumping Updated Abilities Page
    s3.put_object(Bucket='dotam-builds', Key=s3_abilities_key, Body=json.dumps(existing_abilities, indent=None))

    # Dumping Updated Items Page
    s3.put_object(Bucket='dotam-builds', Key=s3_items_key, Body=json.dumps(existing_items, indent=None))

    # Dumping Updated Builds Page
    s3.put_object(Bucket='dotam-builds', Key=s3_builds_key, Body=json.dumps(existing_builds, indent=None))

    print("DONE: ", hero_id, rank)


def sendtos3(builds):

    grouped_builds = defaultdict(list)
    for (hero_id, rank, role, facet), build in builds.items():
        grouped_builds[(hero_id, rank)].append(build)

    print("Amount of builds: ", len(grouped_builds))


    # Thread Pool
    with ThreadPoolExecutor(max_workers=15) as executor:
        futures = {
            executor.submit(process_build, build_group, hero_id, rank): (hero_id, rank)
            for (hero_id, rank), build_group in grouped_builds.items()
        }

        for future in as_completed(futures):
            hero_id, rank = futures[future]
            try:
                future.result(timeout=300)
            except TimeoutError:
                error_message = f"Timeout processing build for hero {hero_id} and rank {rank}"
                send_telegram_message(error_message)
            except Exception as e:
                error_message = f"Error processing build for hero {hero_id} and rank {rank}: {e}"
                send_telegram_message(error_message)

    # # Normal Testing, one by one
    # for (hero_id, rank), build_group in grouped_builds.items():
    #     process_build(build_group, hero_id, rank)

    ## Make Sure Everythings Up to Date
    client = boto3.client('cloudfront')
    response = client.create_invalidation(
        DistributionId='E3TU5F95XHEEA',  # Replace with your CloudFront Distribution ID
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

    # Finished!
    print("Done. Last sequence num: ", seq_num)
    with open(file_path, 'w') as file:
        json.dump({"seq_num": seq_num}, file)

    end_time = time.time()
    elapsed_time = end_time - start_time

    time_message = f"Finished sending to S3. That took {round((elapsed_time/60), 2)} minutes"
    print(time_message)
    send_telegram_message(time_message)

