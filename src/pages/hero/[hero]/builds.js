import { useState, useEffect, useRef } from 'react';
import Router, { useRouter } from 'next/router';
import Head from 'next/head';

import HeroLayout from '../../../components/HeroPage/Layout/HeroLayout.js'
import Builds from '../../../components/HeroPage/Pages/Builds/Builds.js'

import dota2heroes from '../../../../json/dota2heroes.json'

export async function getServerSideProps(context) {

    const hero = dota2heroes.find(hero => hero.url === context.query.hero)
    const patch_res = await fetch("https://dhpoqm1ofsbx7.cloudfront.net/patch.txt")
    const patch = await patch_res.text()

    if(hero){    
        return {
            props: {
              hero: hero,
              patch: patch
            }
        };
    }
}

export default function BuildsPage( { hero, patch } ) {

    const heroName = hero.name
    const page = 'builds'

    return(
        <HeroLayout hero={hero} current_patch={patch} page={page} >

            <Head>
                <title>{heroName} Guide: Builds, Matchups, and Rates</title>
                <meta name="description" 
                    content={`Highest rated builds for ${heroName}. See where they fit in the meta through DotaM's tiering system.`} />
                <meta name="keywords"
                    content={`${heroName}, builds, neutral, neutrals, matchups`} />
                <link rel="icon" href="../images/favicon.ico" type="image/x-icon" />
            </Head>

            <Builds hero={hero} current_patch={patch} />

        </HeroLayout>
    )
}