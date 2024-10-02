for hero in hero_ids:
    cur.execute(f"SELECT * FROM {table} WHERE hero_id = %s", (hero,))
    heroBuilds = cur.fetchall()
    x = 0
    for x in range(len(heroBuilds)):
        heroBuilds[x] = list(heroBuilds[x])
    print("Hero ID: ", hero)
    newHeroBuilds = [slicedBuild for slicedBuild in builds if slicedBuild[0] == hero]
    for build in newHeroBuilds:
        buildFound = False
        for heroBuild in heroBuilds:
            if int(heroBuild[0]) == int(build[0]) and heroBuild[1] == build[1] and heroBuild[2] == build[2] and int(heroBuild[3]) == int(build[3]):

                # Total Matches
                heroBuild[4] += build[4]
                
                # Total Wins 
                heroBuild[5] += build[5]
                
                # Abilities
                for newAbi in build[6]:
                    abiMatch = False
                    for ogAbi in heroBuild[6]:
                        if newAbi['Abilities'] == ogAbi['Abilities']:
                            ogAbi['Matches'] += newAbi['Matches']
                            ogAbi['Wins'] += newAbi['Wins']
                            abiMatch = True
                            break
                    if not abiMatch:
                        heroBuild[6].append(newAbi)
                
                # Talents
                for newTal in build[7]:
                    talMatch = False
                    for ogTal in heroBuild[7]:
                        if newTal['Talent'] == ogTal['Talent']:
                            ogTal['Matches'] += newTal['Matches']
                            ogTal['Wins'] += newTal['Wins']
                            talMatch = True
                            break
                    if not talMatch:
                        heroBuild[7].append(newTal)

                # Starting Items
                for newSta in build[8]:
                    staMatch = False
                    for ogSta in heroBuild[8]:
                        if sorted(newSta['Starting']) == sorted(ogSta['Starting']):
                            ogSta['Matches'] += newSta['Matches']
                            ogSta['Wins'] += newSta['Wins']
                            staMatch = True
                            break
                    if not staMatch:
                        heroBuild[8].append(newSta)

                # Early Items
                for newEar in build[9]:
                    earMatch = False
                    for ogEar in heroBuild[9]:
                        if newEar['Item'] == ogEar['Item'] and newEar['isSecondPurchase'] == ogEar['isSecondPurchase']:
                            ogEar['Matches'] += newEar['Matches']
                            ogEar['Wins'] += newEar['Wins']
                            earMatch = True
                            break
                    if not earMatch:
                        heroBuild[9].append(newEar)
                
                # Core Items
                for newCor in build[10]:
                    corMatch = False
                    for ogCor in heroBuild[10]:
                        if newCor['Core'] == ogCor['Core']:
                            ogCor['Matches'] += newCor['Matches']
                            ogCor['Wins'] += newCor['Wins']
                            m = 3 if len(ogCor['Core']) == 2 else 4
                            for _ in range(7):
                                for newLat in newCor['Late'][str(m)]:
                                    lateFound = False
                                    for ogLat in ogCor['Late'][str(m)]:
                                        if newLat['Item'] == ogLat['Item']:
                                            ogLat['Matches'] += newLat['Matches']
                                            ogLat['Wins'] += newLat['Wins']
                                            lateFound = True
                                            break
                                    if not lateFound:
                                        ogCor['Late'][str(m)].append(newLat)
                                m += 1
                            corMatch = True
                            break
                    if not corMatch:
                        heroBuild[10].append(newCor)

                # Finished updating builds, now upload to database
                print("Uploading a build")
                cur.execute(f"""
                    UPDATE {table}
                    SET total_matches = %s,
                        total_wins = %s,
                        abilities = %s,
                        talents = %s,
                        starting = %s,
                        early = %s,
                        core = %s
                    WHERE hero_id = %s AND rank = %s AND role = %s AND facet = %s 
                """, (heroBuild[4], heroBuild[5], json.dumps(heroBuild[6]), json.dumps(heroBuild[7]), json.dumps(heroBuild[8]), json.dumps(heroBuild[9]), json.dumps(heroBuild[10]), heroBuild[0], heroBuild[1], heroBuild[2], heroBuild[3]))
                conn.commit() 
                print("Uploaded!")

                break