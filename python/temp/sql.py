#!/usr/bin/env python3

import psycopg2
import requests
import os

from dotenv import load_dotenv

load_dotenv()

# My Amazon Database
database_url = os.environ.get('DATABASE_URL')
builds_database_url = os.environ.get('BUILDS_DATABASE_URL')

conn = psycopg2.connect(builds_database_url)
cur = conn.cursor()


cur.execute("""
            
    DROP TABLE IF EXISTS abilities, early, starting, core, late, talents, neutrals, items, main CASCADE;

    CREATE TABLE main (
        build_id SERIAL PRIMARY KEY,
        hero_id INT,
        patch TEXT,
        rank TEXT,
        role TEXT,
        facet INT,
        total_wins INT DEFAULT 0,
        total_matches INT DEFAULT 0
    );
    
    CREATE TABLE abilities (
        build_id INT REFERENCES main(build_id) ON DELETE CASCADE,
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
        build_id INT REFERENCES main(build_id) ON DELETE CASCADE,
        talent INT,
        wins INT DEFAULT 0,
        matches INT DEFAULT 0
    );
    
    CREATE TABLE starting (
        build_id INT REFERENCES main(build_id) ON DELETE CASCADE,
        starting_1 INT,
        starting_2 INT,
        starting_3 INT,
        starting_4 INT,
        starting_5 INT,
        starting_6 INT,
        wins INT DEFAULT 0,
        matches INT DEFAULT 0
    );
    
    CREATE TABLE early (
        build_id INT REFERENCES main(build_id) ON DELETE CASCADE,
        item INT,
        secondpurchase BOOL,
        wins INT DEFAULT 0,
        matches INT DEFAULT 0
    );

    CREATE TABLE core (
        build_id INT REFERENCES main(build_id) ON DELETE CASCADE,
        core_1 INT,
        core_2 INT,
        core_3 INT,
        wins INT DEFAULT 0,
        matches INT DEFAULT 0
    );

    CREATE TABLE late (
        build_id INT REFERENCES main(build_id) ON DELETE CASCADE,
        core_1 INT,
        core_2 INT,
        core_3 INT,
        nth INT,
        item INT,
        wins INT DEFAULT 0,
        matches INT DEFAULT 0
    );

    CREATE TABLE neutrals (
        build_id INT REFERENCES main(build_id) ON DELETE CASCADE,
        tier INT,
        item INT,
        wins INT DEFAULT 0,
        matches INT DEFAULT 0
    );

    CREATE INDEX idx_main ON main(build_id);
    CREATE INDEX idx_starting_items_build ON starting(build_id);
    CREATE INDEX idx_early_items_build ON early(build_id);
    CREATE INDEX idx_core_items_build ON core(build_id);
    CREATE INDEX idx_late_items_build ON late(build_id);
    CREATE INDEX idx_abilities_build ON abilities(build_id);
    CREATE INDEX idx_talents_build ON talents(build_id);
    CREATE INDEX idx_neutrals_build ON neutrals(build_id);
            
    ALTER TABLE main 
    ADD CONSTRAINT unique_main UNIQUE (hero_id, rank, role, facet, patch);

    ALTER TABLE abilities 
    ADD CONSTRAINT unique_abilities UNIQUE (build_id, ability_1, ability_2, ability_3, ability_4, ability_5, ability_6, ability_7, ability_8, ability_9, ability_10, ability_11, ability_12, ability_13, ability_14, ability_15, ability_16);

    ALTER TABLE talents 
    ADD CONSTRAINT unique_talents UNIQUE (build_id, talent);
            
    ALTER TABLE starting
    ADD CONSTRAINT unique_starting UNIQUE (build_id, starting_1, starting_2, starting_3, starting_4, starting_5, starting_6);
            
    ALTER TABLE early 
    ADD CONSTRAINT unique_early UNIQUE (build_id, item, secondpurchase);

    ALTER TABLE core 
    ADD CONSTRAINT unique_core UNIQUE (build_id, core_1, core_2, core_3);

    ALTER TABLE late 
    ADD CONSTRAINT unique_late UNIQUE (build_id, core_1, core_2, core_3, nth, item);
    
    CREATE UNIQUE INDEX unique_late_support
    ON late (build_id, core_1, core_2, nth, item)
    WHERE core_3 IS NULL;

    ALTER TABLE neutrals 
    ADD CONSTRAINT unique_neutrals UNIQUE (build_id, tier, item);

""")

## A way to easily delete all stuff within
# tables = ["abilities", "early", "core", "late", "talents", "neutrals", "items", "builds"]
# patch = "7_38b"

# for table in tables:
#     cur.execute(f"DELETE FROM {table} WHERE patch = %s;", (patch,))

conn.commit()
conn.close()