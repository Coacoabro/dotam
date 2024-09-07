import { useQuery } from 'react-query';

import LoadingWheel from '../components/LoadingWheel';

import Head from "next/head";
import Patches from "../Patches";
import Rank from "../Rank";
import Role from "../Role";
import BottomBar from '../BottomBar';

const fetchTierData = async (hero, type) => {
    const response = await fetch(`/api/tier-list`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
};
  

export default function TierLayout({children}) {

    const { data, isLoading } = useQuery(['tierList'], fetchTierData)
    
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
                        <Role />
                    </div>
                    <div class="flex items-center justify-center space-x-2">
                        <Patches />
                        <Rank />
                    </div>
                </div>
                {isLoading ? (<LoadingWheel />) : (
                    <>
                        <main>
                            {React.Children.map(children, child =>
                            React.cloneElement(child, { initRole, initFacet, heroData, heroBuilds })
                            )}
                        </main>
                        <BottomBar />
                    </>
                )}
            </div>
            
        </div>
    )
}