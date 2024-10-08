import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import RatesContainer from '../src/components/HeroPage/Variable/Rates/RatesContainer';
import StaticInfo from '../src/components/HeroPage/Static/StaticInfo'
import VariableInfo from '../src/components/HeroPage/Variable/VariableInfo'
import Rank from '../src/components/Rank'
import Role from '../src/components/Role'

import dota2heroes from '../json/dota2heroes.json'

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

export default function HeroPage({ hero, info, rates, builds, abilities, items, matchups }) {

  const heroData = info[0]

  const heroID = hero.id
  const heroName = hero.name

  const highestPickRateRole = rates
    .filter(rate => rate.role !== "" && rate.rank == "")
    .reduce((max, rate) => rate.pickrate > max.pickrate ? rate : max, {pickrate: 0});
  
  const initialRole = highestPickRateRole.role

  if(heroData){

    const portrait = 'https://cdn.cloudflare.steamstatic.com' + heroData.img
    const crop_img = 'https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/crops/' + heroData.name.replace('npc_dota_hero_', '') + '.png'
    const hero_vid = 'https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/' + heroData.name.replace('npc_dota_hero_', '') + '.webm'

    return(
      <div>
        <Head>
          <title>{heroName} Guide: Builds, Matchups, and Rates</title>
          <meta name="description" 
            content={`Highest rated builds for ${heroName}. See where they fit in the meta through DotaM's tiering system.`} />
          <meta name="keywords"
            content={`${heroName}, builds, neutral, neutrals, matchups`} />
          <link rel="icon" href="../images/favicon.ico" type="image/x-icon" />
        </Head>

        <div className="px-4 sm:pt-4 sm:mx-auto sm:max-w-7xl space-y-2 sm:space-y-0">
          <div className="px-2 flex relative items-end sm:items-center gap-1 sm:gap-4">
            <img src={portrait} className="h-14 sm:h-32" />
            <div className="sm:py-7 sm:px-2 flex-col space-y-2 z-20">
              <div className="text-2xl sm:text-5xl font-bold ml-2">{heroName}</div>
              <div className="hidden sm:block"><StaticInfo hero={heroData} /></div>
            </div>
            <div className="hidden sm:flex absolute right-0 mt-24 h-72 opacity-25">
              <img src={crop_img} className="object-cover w-full h-full" />
            </div>
          </div>
          <div className="sm:hidden absolute h-36 right-0 top-14 opacity-25">
            <img src={crop_img} className="object-cover w-full h-full" />
          </div>
          <div className="absolute sm:hidden z-10">
            <StaticInfo hero={heroData} />
          </div>
          <div className="sm:mx-auto sm:max-w-7xl relative z-0">
            <VariableInfo hero={heroData} rates={rates} initRole={initialRole} abilities={abilities} builds={builds} matchups={matchups} />
          </div>
        </div>
        
      </div>
    )
  }
  
}