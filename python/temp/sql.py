#!/usr/bin/env python3

import psycopg2
import requests
import os
import gzip

from dotenv import load_dotenv

load_dotenv()

# My Amazon Database
database_url = os.environ.get('DATABASE_URL')
builds_database_url = os.environ.get('BUILDS_DATABASE_URL')

conn = psycopg2.connect(builds_database_url)
cur = conn.cursor()

# cur.execute("""
#     CREATE INDEX late_index ON late (build_id, core_items, nth, item)
# """)

# with gzip.open('./python/content_data/abilities.csv.gz', 'wt', encoding='utf-8') as f:
#     cur.copy_expert("COPY abilities TO STDOUT WITH CSV HEADER", f)

cur.execute("""
    CREATE DATABASE build_patch_template;

    \c build_patch_template;

    CREATE TABLE builds (
        build_id INT PRIMARY KEY,
        hero_id INT NOT NULL,
        rank TEXT NOT NULL,
        role TEXT NOT NULL,
        facet INT NOT NULL,
        wins INT DEFAULT 0,
        matches INT DEFAULT 0
    );
    
    CREATE TABLE abilities (
        build_id INT REFERENCES builds(build_id) ON DELETE CASCADE,
        ability_1 INT,
        ability_2 INT,
        ability_3 INT,
        ability_4 INT,
        ability_5 INT,
        ability_6 INT,
        ability_7 INT,
        ability_8 INT,
        ability_9 INT,
        ability_10 INT,
        ability_11 INT,
        ability_12 INT,
        ability_13 INT,
        ability_14 INT,
        ability_15 INT,
        ability_16 INT,
        wins INT DEFAULT 0,
        matches INT DEFAULT 0
    );
            
    CREATE TABLE talents (
        build_id INT REFERENCES builds(build_id) ON DELETE CASCADE,
        talent INT,
        wins INT DEFAULT 0,
        matches INT DEFAULT 0
    );
    
    CREATE TABLE starting (
        build_id INT REFERENCES builds(build_id) ON DELETE CASCADE,
        starting_1 INT,
        starting_2 INT,
        starting_3 INT,
        starting_4 INT,
        starting_5 INT,
        starting_6 INT,
        wins INT DEFAULT 0,
        matches INT DEFAULT 0
    )
    
    CREATE TABLE early (
        build_id INT REFERENCES builds(build_id) ON DELETE CASCADE,
        item INT,
        secondpurchase BOOL,
        wins INT DEFAULT 0,
        matches INT DEFAULT 0
    )

    CREATE TABLE core (
        build_id INT REFERENCES builds(build_id) ON DELETE CASCADE,
        core_id INT,
        core_1 INT,
        core_2 INT,
        core_3 INT,
        wins INT DEFAULT 0,
        matches INT DEFAULT 0
    );

    CREATE TABLE late (
        build_id INT REFERENCES builds(build_id) ON DELETE CASCADE,
        core_id INT REFERENCES core(core_id) ON DELETE CASCADE,
        nth INT,
        item INT,
        wins INT DEFAULT 0,
        matches INT DEFAULT 0
    );

    CREATE TABLE neutrals (
        build_id INT REFERENCES builds(build_id) ON DELETE CASCADE,
        tier INT NOT NULL,
        item INT NOT NULL,
        wins INT DEFAULT 0,
        matches INT DEFAULT 0
    );

    -- Indexing for faster queries
    CREATE INDEX idx_starting_items_build ON starting(build_id);
    CREATE INDEX idx_early_items_build ON early(build_id);
    CREATE INDEX idx_core_items_build ON core(build_id);
    CREATE INDEX idx_late_items_build ON late(build_id);
    CREATE INDEX idx_abilities_build ON abilities(build_id);
    CREATE INDEX idx_talents_build ON talents(build_id);
    CREATE INDEX idx_neutrals_build ON neutrals(build_id);

""")

conn.commit()
conn.close()