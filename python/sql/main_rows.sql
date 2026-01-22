SELECT * FROM (
    SELECT    
        hero_id,
        rank,
        role,
        facet,
        SUM(wins) as total_wins,
        SUM(matches) as total_matches     
    FROM main
    WHERE hero_id = %(hero_id)s
    GROUP BY hero_id, rank, role, facet
)