import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Script from 'next/script';

import LoadingWheel from '../components/LoadingWheel';
import TierContainer from '../components/TierList/TierContainer';
import Head from "next/head";
import Patches from '../components/Patches';
import Rank from "../components/Rank";
import Role from "../components/Role";
import BottomBar from '../components/BottomBar';
import HeroSearch from '../components/Home/Heroes/HeroSearch';
import Ad from '../components/Ads/Venatus/Ad';
import PatchesJson from '../../json/Patches.json'
import { useRouter } from 'next/router';

const fetchTierData = async (patch) => {

    const response = await fetch(`/api/tier-list?patch=${patch}`)

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const json = await response.json()
    return json;
};

export default function TierList() {

    const router = useRouter()
    const {patch} = router.query

    const [searchTerm, setSearchTerm] = useState('')
    const [currPatch, setCurrPatch] = useState(patch || PatchesJson[0].Patch)

    useEffect(() => {
        if(patch){setCurrPatch(patch)}
    },[patch])

    const handleSearch = (term) => {
        if(term.toLowerCase() == "tracker") {
            setSearchTerm("Bounty Hunter")
            }
        else{setSearchTerm(term)}
    }

    const { data, isLoading, error } = useQuery(['tierList', currPatch], () => fetchTierData(currPatch), {enabled: !!currPatch,})
    console.log(data, isLoading, error)
    
    return(
        <div className=''>

            <Head>
                <title>Dota 2 Tier Lists</title>
                <meta name="description" 
                content="Dota 2 tier list based on current win rates and pick rates from almost all ranked games played within the current patch" />
                <meta name="keywords" 
                content="Dota 2 Tier List, Dota 2 Hero Rankings, Best Dota 2 Heroes, Top Dota 2 Heroes, Dota 2 Hero Tier Rankings, Dota 2 Hero Guide, Dota 2 Meta Tier List, Dota 2 Patch Tier List, Dota 2 Competitive Tier List, Dota 2 Hero Strengths and Weaknesses, Dota 2 Ranked Heroes, Dota 2 Best Heroes for Patch, Dota 2 High-Rank Hero Picks, Dota 2 Pro Meta Tier List, Dota 2 Hero Rankings by Role, Dota 2 Tier List for Rank, Dota 2 Best Carry Heroes, Dota 2 Best Support Heroes, Dota 2 Hero Rankings by Patch, Dota 2 Hero Tier List by Meta, Dota 2 Tier List 2024, Dota 2 Hero Balance, Dota 2 Hero Tiers" />
                <meta name="google-adsense-account"
                content="ca-pub-2521697717608899" />
                <link rel="icon" href="images/favicon.ico" type="image/x-icon" />
            </Head>

            <Script 
                async 
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2521697717608899" 
                crossOrigin="anonymous"
            />

            <div className="max-w-7xl mx-auto px-1 sm:px-4 sm:space-y-4 text-white sm:pt-8">
                <div className="text-xl sm:text-3xl px-2 sm:px-0 py-2 sm:py-4 font-semibold flex justify-between items-end">
                    Dota 2 Tier List
                    <Ad placementName="leaderboard" />
                </div>
                <div className="text-sm sm:text-xl text-gray-300 px-2 sm:px-0 py-1 opacity-50">A tier list based on current win rates and pick rates from almost all games played within the current patch</div>
                <div className="py-2 justify-between text-white space-y-2 sm:flex">
                    <div className="flex items-center justify-center space-x-2">
                        <HeroSearch onSearch={handleSearch} />
                    </div>
                    <div class="hidden sm:flex items-center justify-center space-x-2">
                        <Role />
                        <Patches />
                        <Rank />
                    </div>
                    <div class="flex flex-col sm:hidden items-center justify-center space-y-2">
                        <Role />
                        <div className='flex gap-6'>
                            <Patches />
                            <Rank />
                        </div>
                    </div>
                </div>
                {isLoading ? (<LoadingWheel />) : (
                    <TierContainer heroes={data.heroes} rates={data.rates} matchups={data.matchups} search={searchTerm} />
                )}
            </div>

            {data ? (
                <div className='pt-12'>
                    <BottomBar />
                </div>
            ) : null}
            
            {/* <VerticalAd slot="9393446382" />
            <SquareAd slot="7585670579" />

            <div className='mx-auto'>
                <BottomBarAd slot="2221793137" />
                <MobileAd slot="9032362034" />
            </div> */}
            
        </div>
    )
}