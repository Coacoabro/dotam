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
        console.log(rates_res)
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
            KeywordsContent = ``
            break
        case 'items':
            PageComponent = <Items current_patch={patch} />
            MetaContent = `Highest rated items for ${heroName}. Find the best items from the beginning to the end of the game`
            GuideContent = `Items - Early, Core, Late, Neutrals`
            KeywordsContent = ``
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
                <link rel="icon" href="../images/favicon.ico" type="image/x-icon" />
            </Head>

            {PageComponent}
        </HeroLayout>
    );
}
