query = f"""
    query{{
        heroStats {{
        heroVsHeroMatchup(heroId: {heroId}, bracketBasicIds: {ranks}) {{
        advantage {{
            vs {{
            heroId2
            winRateHeroId2
            matchCount
            }}
            with {{
            heroId2
            winCount
            matchCount
            }}
        }}
        }}
    }}
    }}
    """