import { data } from "autoprefixer"
import heroURLs from "../../../json/dota2heroes.json"

export default async function handler(req, res) {

    const { patch } = req.query

    try {

        const heroesResult = await fetch(`https://dhpoqm1ofsbx7.cloudfront.net/data/heroes.json`)
        const heroes = await heroesResult.json()
        const metaResults = await fetch(`https://dhpoqm1ofsbx7.cloudfront.net/data/${patch}/meta_heroes.json`)
        const metaHeroes = await metaResults.json()

        const heroLookup = heroes.reduce((acc, hero) => {
            acc[hero.hero_id] = hero
            return acc;
        }, {})

        const metaData = {}

        for (const [role, stats] of Object.entries(metaHeroes)) {

            const hero = stats.hero_id
            const heroURL = heroURLs.find(item => item.id === hero)
            const url = heroURL ? heroURL.url : null
            const buildsResult = await fetch(`https://d3b0g9x0itdgze.cloudfront.net/data/${patch}/${hero}//builds.json`)
            const builds = await buildsResult.json()
            const heroInfo = heroLookup[hero] || {}

            
            metaData[role] = {
                hero_id: hero,
                name: heroInfo.localized_name,
                img: heroInfo.img,
                url: url,
                wr: (stats.winrate*100).toFixed(2),
                core: builds[role][0]["items"]["core"][0]["Permutations"][0]["core"]
            }
        }

        res.status(200).json(metaData);

    } catch (error) {
        console.error('Error fetching meta hero data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
