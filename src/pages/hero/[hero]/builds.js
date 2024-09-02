import { useState, useEffect, useRef } from 'react';
import Router, { useRouter } from 'next/router';
import Head from 'next/head';

import HeroLayout from '../../../components/HeroPage/Layout/HeroLayout.js'
import Builds from '../../../components/HeroPage/Pages/Builds/Builds.js'

import dota2heroes from '../../../../json/dota2heroes.json'

export async function getServerSideProps(context) {
    const hero = dota2heroes.find(hero => hero.url === context.query.hero)
    if(hero){    
        return {
            props: {
              hero: hero
            }
        };
    }
}

export default function BuildsPage( {hero} ) {

    const heroName = hero.name
    
    return(
        <HeroLayout hero={hero} >

            <Head>
                <title>{heroName} Guide: Builds, Matchups, and Rates</title>
                <meta name="description" 
                    content={`Highest rated builds for ${heroName}. See where they fit in the meta through DotaM's tiering system.`} />
                <meta name="keywords"
                    content={`${heroName}, builds, neutral, neutrals, matchups`} />
                <link rel="icon" href="../images/favicon.ico" type="image/x-icon" />
            </Head>

            <Builds hero={hero} />

        </HeroLayout>
    )
}