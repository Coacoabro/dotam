import { useRouter } from 'next/router';
import Head from 'next/head';

import HeroLayout from '../../../components/HeroPage/Layout/HeroLayout.js';

import Patches from '../../../../json/Patches.json'

import Builds from '../../../components/HeroPage/Pages/Builds/Builds.js';
import Items from '../../../components/HeroPage/Pages/Items/Items.js';
import Abilities from '../../../components/HeroPage/Pages/Abilities/Abilities.js';
import Matchups from '../../../components/HeroPage/Pages/Matchups/Matchups.js';

import dota2heroes from '../../../../json/dota2heroes.json';
import BottomBarAd from '../../../components/Ads/Google/BottomBarAd.js';
import SquareAd from '../../../components/Ads/Google/SquareAd.js';
import VerticalAd from '../../../components/Ads/Google/VerticalAd.js';
import MobileAd from '../../../components/Ads/Google/MobileAd.js'
import Script from 'next/script.js';

export async function getServerSideProps(context) {
    const { rank } = context.query
    const hero = dota2heroes.find(hero => hero.url === context.query.hero);
    const patch = Patches[0].Patch
    if(hero && patch){

        let maxMatches = 0
        let initRole = ""
        let initFacet = ""

        const summary_res = await fetch(`https://d3b0g9x0itdgze.cloudfront.net/data/${patch}/${hero.id}/${rank ? rank : ""}/summary.json`)
        const summary = await summary_res.json()
        const rates_res = await fetch(`https://dhpoqm1ofsbx7.cloudfront.net/data/${patch}/${hero.id}/rates/${rank ? rank : ""}/rates.json`)
        const rates = await rates_res.json()

        for (const role in summary) {
            const facets = summary[role]
            for (const facet in facets) {
                const { total_matches } = facets[facet]
                if (total_matches > maxMatches) {
                    maxMatches = total_matches
                    initRole = role
                    initFacet = facet
                }
            }
        }

        return {
            props: {
                hero: hero,
                patch: patch,
                rates: rates,
                summary: summary,
                initRole: initRole,
                initFacet: initFacet
            },
        };
    }
}

export default function HeroPage({ hero, patch, rates, summary, initRole, initFacet }) {
    const router = useRouter();
    const { page } = router.query;

    const heroName = hero.name;  



    // Determine which page to render based on the 'page' query
    let PageComponent
    let MetaContent
    let GuideContent
    let KeywordsContent
    let VerticalSlot = ""
    let SquareSlot = ""
    let BottomSlot = ""
    let MobileSlot = ""

    switch (page) {
        case 'abilities':
            PageComponent = <Abilities current_patch={patch} />
            MetaContent = `Highest rated abilities and talents for ${heroName}.`
            GuideContent = `Abilities and Talents`
            KeywordsContent = `${heroName} abilities, ${heroName} talents, Best abilities for ${heroName}, Best talents for ${heroName}, ${heroName} ability guide, ${heroName} talent guide, Highest rated abilities for ${heroName}, Highest rated talents for ${heroName}, Dota 2 ${heroName} abilities, Dota 2 ${heroName} talents, ${heroName} ability build, ${heroName} talent build`
            VerticalSlot = "8840790347"
            SquareSlot = "3768255622"
            BottomSlot = "4051498092"
            MobileSlot = "8725240278"
            break
        case 'builds':
            PageComponent = <Builds hero={hero} current_patch={patch} />
            MetaContent = `Highest rated builds for ${heroName}. Find everything from items to abilities!`
            GuideContent = `Builds`
            KeywordsContent = `Dota 2 ${heroName} builds, ${heroName} hero builds, Best Dota 2 ${heroName} builds, Pro player ${heroName} builds, ${heroName} guides, ${heroName} guide, ${heroName} build, Best ${heroName} build, ${heroName} build guides, ${heroName} item builds, ${heroName} skill builds, ${heroName} ability builds, ${heroName} core builds, ${heroName} starting items, ${heroName} early game builds, ${heroName} late game builds, ${heroName} strategies, Optimal ${heroName} builds, Ranked ${heroName} builds, High MMR ${heroName} builds, ${heroName} role-specific builds, ${heroName} support builds, ${heroName} carry builds, ${heroName} mid-lane builds, ${heroName} offlane builds, ${heroName} jungle builds, Patch meta ${heroName} builds, ${heroName} build recommendations, Popular ${heroName} builds, Match-winning ${heroName} builds, Competitive ${heroName} builds, ${heroName} tier list builds, ${heroName} meta builds, Winning ${heroName} strategies, ${heroName} skill leveling, ${heroName} talent builds, ${heroName} item progression, ${heroName} win rate builds, ${heroName} build optimization, ${heroName} build analysis, ${heroName} facet builds, ${heroName} build variations, ${heroName} draft synergy builds, ${heroName} counter builds, ${heroName} matchup builds, Ranked ${heroName} role builds, Team-based ${heroName} builds, Solo queue ${heroName} builds, Patch-specific ${heroName} builds, ${heroName} performance builds, ${heroName} build customization`
            VerticalSlot = "1448902987"
            SquareSlot = "6234325805"
            BottomSlot = "5282810981"
            MobileSlot = "3499726534"
            break
        case 'items':
            PageComponent = <Items current_patch={patch} />
            MetaContent = `Highest rated items for ${heroName}. Find the best items from the beginning to the end of the game`
            GuideContent = `Items - Early, Core, Late, Neutrals`
            KeywordsContent = `Dota 2 ${heroName} items, Best ${heroName} item builds, Best ${heroName} item build, ${heroName} starting items, ${heroName} early game items, ${heroName} core items, ${heroName} late game items, ${heroName} item progression, ${heroName} neutral items, Optimal ${heroName} item builds, Pro player ${heroName} item builds, ${heroName} item guide, Recommended items for ${heroName}, ${heroName} item strategy, ${heroName} item analysis, ${heroName} item timings, ${heroName} item synergy, ${heroName} situational items, ${heroName} item builds for support, ${heroName} item builds for carry, ${heroName} item builds for mid-lane, ${heroName} item builds for offlane, ${heroName} item builds for jungle, Patch meta ${heroName} item builds, ${heroName} item optimization, Popular ${heroName} item choices, Winning item sets for ${heroName}, ${heroName} item tier list, ${heroName} competitive item builds, ${heroName} build paths, ${heroName} draft item strategy, ${heroName} counter item builds, ${heroName} item build recommendations, ${heroName} team-based item builds, Solo queue ${heroName} item builds, ${heroName} item customization, ${heroName} patch-specific item choices, ${heroName} item win rate, ${heroName} item roles, ${heroName} effective items, ${heroName} high MMR item builds, ${heroName} role-specific item builds, ${heroName} build item variations, ${heroName} ranked item builds, ${heroName} core item sets, ${heroName} best early items, ${heroName} neutral item picks, ${heroName} build performance items, ${heroName} item flexibility, ${heroName} winning item builds`
            VerticalSlot = "3292950193"
            SquareSlot = "8942790758"
            BottomSlot = "3437083138"
            MobileSlot = "5168031427"
            break
        case 'matchups':
            PageComponent = <Matchups current_patch={patch} />
            MetaContent = `See which heroes counter and synergizes with ${heroName} the best!`
            GuideContent = `Matchups - Counters and Synergies`
            KeywordsContent = `${heroName} matchups, ${heroName} counters, ${heroName} synergies, ${heroName} counterpicks, ${heroName} best allies, ${heroName}'s best allies, ${heroName} worst matchups, ${heroName}'s worst matchups, How to counter ${heroName}, Best heroes against ${heroName}, Best heroes with ${heroName}, ${heroName} Dota 2 matchups, Counters and synergies for ${heroName}, Dota 2 hero counters`
            VerticalSlot = "9112253086"
            SquareSlot = "8497838125"
            BottomSlot = "1365453568"
            MobileSlot = "6481113091"
            break
        default:
            PageComponent = <div>Page not found</div>
    }

    return (
        <HeroLayout hero={hero} current_patch={patch} page={page} rates={rates} summary={summary} initRole={initRole} initFacet={initFacet}>
            <Head>
                <title>{heroName} Guide: {GuideContent}</title>
                <meta name="description"
                    content={MetaContent} />
                <meta name="keywords"
                    content={KeywordsContent} />
                <meta name="google-adsense-account"
                    content="ca-pub-2521697717608899" />
                <link rel="icon" href="../../images/favicon.ico" type="image/x-icon" />
            </Head>

            <Script 
                async 
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2521697717608899" 
                crossOrigin="anonymous"
            />

            {PageComponent}
            
        </HeroLayout>
    );
}
