import React from 'react'
import Head from 'next/head';

function Basics() {
    return(
        <div>
            <Head>
            <title>Dota 2 Basics - DotaM</title>
            <meta name="description" 
                content={`WORK IN PROGRESS. Get a deeper understanding of Dota 2.`} />
            <meta name="keywords"
                content="dota basics, dota explained" />
            <link rel="icon" href="images/favicon.ico" type="image/x-icon" />
            </Head>
            <div class="text-white">
                Work in progress
            </div>
        </div>
    );
}

export default Basics