import { useRouter } from 'next/router';
import Head from 'next/head';

import HeroLayout from '../../../components/HeroPage/Layout/HeroLayout.js';

import Builds from '../../../components/HeroPage/Pages/Builds/Builds.js';
import Items from '../../../components/HeroPage/Pages/Items/Items.js';
import Abilities from '../../../components/HeroPage/Pages/Abilities/Abilities.js';
import Matchups from '../../../components/HeroPage/Pages/Matchups/Matchups.js';

import dota2heroes from '../../../../json/dota2heroes.json';

export async function getServerSideProps(context) {
    const hero = dota2heroes.find(hero => hero.url === context.query.hero);
    const patch_res = await fetch("https://dhpoqm1ofsbx7.cloudfront.net/patch.txt");
    const patch = await patch_res.text()
    if(hero && patch){
        const rates_res = await fetch(`https://dhpoqm1ofsbx7.cloudfront.net/data/${patch.replace(".", "_")}/${hero.id}/rates.json`)
        const rates = await rates_res.json()

        return {
            props: {
                hero: hero,
                patch: patch,
                rates: rates,
            },
        };
    }
}

export default function HeroPage({ hero, patch, rates }) {
    const router = useRouter();
    const { page } = router.query;

    const heroName = hero.name;

    const highestPickRateRole = rates
      .filter(rate => rate.role !== "" && rate.rank == "")
      .reduce((max, rate) => rate.pickrate > max.pickrate ? rate : max, {pickrate: 0});
    
    const initRole = highestPickRateRole.role

    // Determine which page to render based on the 'page' query
    let PageComponent
    let MetaContent
    let GuideContent
    let KeywordsContent

    switch (page) {
        case 'abilities':
            PageComponent = <Abilities current_patch={patch} />
            MetaContent = `Highest rated abilities and talents for ${heroName}.`
            GuideContent = `Abilities and Talents`
            KeywordsContent = ``
            break
        case 'builds':
            PageComponent = <Builds hero={hero} current_patch={patch} />
            MetaContent = `Highest rated builds for ${heroName}. See where they fit in the meta through DotaM's tiering system.`
            GuideContent = `Builds`
            KeywordsContent = `Dota 2 ${heroName} builds, ${heroName} hero builds, Best Dota 2 ${heroName} builds, Pro player ${heroName} builds, ${heroName} guides, ${heroName} build guides, ${heroName} item builds, ${heroName} skill builds, ${heroName} ability builds, ${heroName} core builds, ${heroName} starting items, ${heroName} early game builds, ${heroName} late game builds, ${heroName} strategies, Optimal ${heroName} builds, Ranked ${heroName} builds, High MMR ${heroName} builds, ${heroName} role-specific builds, ${heroName} support builds, ${heroName} carry builds, ${heroName} mid-lane builds, ${heroName} offlane builds, ${heroName} jungle builds, Patch meta ${heroName} builds, ${heroName} build recommendations, Popular ${heroName} builds, Match-winning ${heroName} builds, Competitive ${heroName} builds, ${heroName} tier list builds, ${heroName} meta builds, Winning ${heroName} strategies, ${heroName} skill leveling, ${heroName} talent builds, ${heroName} item progression, ${heroName} win rate builds, ${heroName} build optimization, ${heroName} build analysis, ${heroName} facet builds, ${heroName} build variations, ${heroName} draft synergy builds, ${heroName} counter builds, ${heroName} matchup builds, Ranked ${heroName} role builds, Team-based ${heroName} builds, Solo queue ${heroName} builds, Patch-specific ${heroName} builds, ${heroName} performance builds, ${heroName} build customization`
            break
        case 'items':
            PageComponent = <Items current_patch={patch} />
            MetaContent = `Highest rated items for ${heroName}. Find the best items from the beginning to the end of the game`
            GuideContent = `Items - Early, Core, Late, Neutrals`
            KeywordsContent = `Dota 2 ${heroName} items, Best ${heroName} item builds, ${heroName} starting items, ${heroName} early game items, ${heroName} core items, ${heroName} late game items, ${heroName} item progression, ${heroName} neutral items, Optimal ${heroName} item builds, Pro player ${heroName} item builds, ${heroName} item guide, Recommended items for ${heroName}, ${heroName} item strategy, ${heroName} item analysis, ${heroName} item timings, ${heroName} item synergy, ${heroName} situational items, ${heroName} item builds for support, ${heroName} item builds for carry, ${heroName} item builds for mid-lane, ${heroName} item builds for offlane, ${heroName} item builds for jungle, Patch meta ${heroName} item builds, ${heroName} item optimization, Popular ${heroName} item choices, Winning item sets for ${heroName}, ${heroName} item tier list, ${heroName} competitive item builds, ${heroName} build paths, ${heroName} draft item strategy, ${heroName} counter item builds, ${heroName} item build recommendations, ${heroName} team-based item builds, Solo queue ${heroName} item builds, ${heroName} item customization, ${heroName} patch-specific item choices, ${heroName} item win rate, ${heroName} item roles, ${heroName} effective items, ${heroName} high MMR item builds, ${heroName} role-specific item builds, ${heroName} build item variations, ${heroName} ranked item builds, ${heroName} core item sets, ${heroName} best early items, ${heroName} neutral item picks, ${heroName} build performance items, ${heroName} item flexibility, ${heroName} winning item builds`
            break
        case 'matchups':
            PageComponent = <Matchups current_patch={patch} />
            MetaContent = `See which heroes counter and synergizes with ${heroName} the best!`
            GuideContent = `Matchups - Counters and Synergies`
            KeywordsContent = ``
            break
        default:
            PageComponent = <div>Page not found</div>
    }

    return (
        <HeroLayout hero={hero} current_patch={patch} page={page} rates={rates} initRole={initRole}>
            <Head>
                <title>{heroName} Guide: {GuideContent}</title>
                <meta name="description"
                    content={MetaContent} />
                <meta name="keywords"
                    content={KeywordsContent} />
                <meta name="google-adsense-account"
                    content="ca-pub-2521697717608899" />
                <link rel="icon" href="../../images/favicon.ico" type="image/x-icon" />
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2521697717608899"
                    crossorigin="anonymous"></script>
            </Head>

            {PageComponent}
        </HeroLayout>
    );
}