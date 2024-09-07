import { useState } from 'react';
import { useQuery } from 'react-query';

import LoadingWheel from '../components/LoadingWheel';
import TierContainer from '../components/TierList/TierContainer';
import Head from "next/head";
import Patches from '../components/Patches';
import Rank from "../components/Rank";
import Role from "../components/Role";
import BottomBar from '../components/BottomBar';
import HeroSearch from '../components/Home/Heroes/HeroSearch';

const fetchTierData = async (hero, type) => {
    const response = await fetch(`/api/tier-list`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
};

export default function TierList() {

    const [searchTerm, setSearchTerm] = useState('')

    const handleSearch = (term) => {
      setSearchTerm(term)
    }

    const { data, isLoading } = useQuery(['tierList'], fetchTierData)

    console.log(searchTerm)
    
    return(
        <div>

            <Head>
                <title>Dota 2 Tier Lists</title>
                <meta name="description" 
                content="Dota 2 tier list based on current win rates and pick rates from almost all games played within the current patch" />
                <meta name="keywords"
                content="Dota 2, Tier List, Tier, Best Heroes, Best Hero, dota, gg" />
                <meta name="google-adsense-account"
                content="ca-pub-2521697717608899" />
                <link rel="icon" href="images/favicon.ico" type="image/x-icon" />
            </Head>

            <div className="max-w-7xl mx-auto px-1 sm:px-4 sm:space-y-4 text-white sm:pt-8">
                <div className="text-xl sm:text-3xl px-2 sm:px-0 py-2 sm:py-4 font-semibold">Dota 2 Tier List</div>
                <div className="text-sm sm:text-xl text-gray-300 px-2 sm:px-0 py-1 opacity-50">A tier list based on current win rates and pick rates from almost all games played within the current patch</div>
                <div className="py-2 justify-between text-white space-y-2 sm:flex">
                    <div className="flex items-center justify-center space-x-2">
                        <HeroSearch onSearch={handleSearch} />
                    </div>
                    <div class="flex items-center justify-center space-x-2">
                        <Role />
                        <Patches />
                        <Rank />
                    </div>
                </div>
                {isLoading ? (<LoadingWheel />) : (
                    <>
                        <TierContainer heroes={data.heroes} rates={data.rates} matchups={data.matchups} search={searchTerm} />
                        <div className='absolute left-0 pt-12 '><BottomBar /></div>
                    </>
                )}
            </div>
            
        </div>
    )
}