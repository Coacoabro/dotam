import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import HeroLayout from '../../../components/HeroPage/HeroLayout'
import Builds from '../../../components/HeroPage/Builds/Builds.js'

import dota2heroes from '../../../../json/dota2heroes.json'

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function getServerSideProps(context) {

    const hero = dota2heroes.find(hero => hero.url === context.query.hero)
    if(hero){
        const client = await pool.connect();
        const res1 = await client.query('SELECT * FROM heroes WHERE hero_id = $1', [hero.id]);
        const res2 = await client.query('SELECT * FROM rates WHERE hero_id = $1', [hero.id]);
        const res3 = await client.query('SELECT * FROM builds WHERE hero_id = $1', [hero.id]);
        const res6 = await client.query('SELECT * FROM matchups WHERE hero_id = $1', [hero.id]);
        client.release();

        return {
            props: {
            hero: hero,
            info: res1.rows,
            rates: res2.rows,
            builds: res3.rows,
            matchups: res6.rows
            }
        };
    }
}

export default function BuildsPage({ hero, info, rates, builds, matchups }) {

    const heroName = hero.name
    
    return(
        <HeroLayout hero={hero} rates={rates} info={info}>

            <Head>
                <title>{heroName} Guide: Builds, Matchups, and Rates</title>
                <meta name="description" 
                    content={`Highest rated builds for ${heroName}. See where they fit in the meta through DotaM's tiering system.`} />
                <meta name="keywords"
                    content={`${heroName}, builds, neutral, neutrals, matchups`} />
                <link rel="icon" href="../images/favicon.ico" type="image/x-icon" />
            </Head>

            <Builds builds={builds} matchups={matchups} />

        </HeroLayout>
    )
}