import { useState, useEffect, useRef } from 'react';
import Router, { useRouter } from 'next/router';
import Head from 'next/head';

import HeroLayout from '../../../components/HeroPage/Layout/HeroLayout.js'
import Abilities from '../../../components/HeroPage/Pages/Abilities/Abilities.js';

import dota2heroes from '../../../../json/dota2heroes.json'

export async function getServerSideProps(context) {

    const hero = dota2heroes.find(hero => hero.url === context.query.hero)
    const res = await fetch("https://dhpoqm1ofsbx7.cloudfront.net/patch.txt")
    const patch = await res.text()

    if(hero){    
        return {
            props: {
              hero: hero,
              patch: patch
            }
        };
    }
}

export default function ItemsPage({ hero, patch }) {

    const heroName = hero.name
    
    return(
        <HeroLayout hero={hero} current_patch={patch} >

            <Head>
                <title>{heroName} Guide: Builds, Matchups, and Rates</title>
                <meta name="description" 
                    content={`Highest rated builds for ${heroName}. See where they fit in the meta through DotaM's tiering system.`} />
                <meta name="keywords"
                    content={`${heroName}, builds, neutral, neutrals, matchups`} />
                <link rel="icon" href="../images/favicon.ico" type="image/x-icon" />
            </Head>

            <Abilities current_patch={patch} />

        </HeroLayout>
    )
}