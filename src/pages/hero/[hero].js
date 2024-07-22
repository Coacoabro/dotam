import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import RatesContainer from '../../components/HeroPage/Variable/Rates/RatesContainer';
import StaticInfo from '../../components/HeroPage/Static/StaticInfo'
import VariableInfo from '../../components/HeroPage/Variable/VariableInfo'
import Rank from '../../components/Rank'
import Role from '../../components/Role'

import dota2heroes from '../../../json/dota2heroes.json'

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function getServerSideProps(context) {

  const hero = dota2heroes.find(hero => hero.url === context.query.hero)

  const client = await pool.connect();
  const res1 = await client.query('SELECT * FROM heroes WHERE hero_id = $1', [hero.id]);
  const res2 = await client.query('SELECT * FROM rates WHERE hero_id = $1', [hero.id]);
  const res3 = await client.query('SELECT * FROM builds WHERE hero_id = $1', [hero.id]);
  const res4 = await client.query('SELECT * FROM abilities WHERE hero_id = $1', [hero.id]);
  const res5 = await client.query('SELECT * FROM items WHERE hero_id = $1', [hero.id]);
  const res6 = await client.query('SELECT * FROM matchups WHERE hero_id = $1', [hero.id]);
  client.release();

  return {
      props: {
        hero: hero,
        info: res1.rows,
        rates: res2.rows,
        builds: res3.rows,
        abilities: res4.rows,
        items: res5.rows,
        matchups: res6.rows
      }
  };
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

        <div className="pt-4 mx-auto max-w-7xl">
          <div className="flex relative items-center gap-4">
            <img src={portrait} className="h-32" />
            <div className="py-7 px-2 z-30">
              <StaticInfo hero={heroData} />
            </div>
            {/* <div className="absolute right-0 mt-72 w-[500px] opacity-25">
              <video src={hero_vid} type="video/webm" loop autoPlay disablePictureInPicture className='object-cover w-full'/>
            </div> */}
            <div className="absolute right-0 mt-24 h-72 opacity-25">
              <img src={crop_img} className="object-cover w-full h-full" />
            </div>
          </div>

          <div className="mx-auto max-w-7xl z-20 relative">
            <VariableInfo hero={heroData} rates={rates} initRole={initialRole} abilities={abilities} builds={builds} matchups={matchups} />
          </div>
        </div>
        

      </div>
    )
  }
  
}