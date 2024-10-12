import { Pool } from 'pg';
import dota2heroes from '../../../json/dota2heroes.json'
import Patches from '../../../json/Patches.json'

const rates_pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const builds_pool = new Pool({
  connectionString: process.env.BUILDS_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  const { hero } = req.query
  const { type } = req.query
  const { patch } = req.query

  try {
    const heroData = dota2heroes.find(h => h.url === hero);

    if (!heroData) {
      return res.status(404).json({ error: 'Hero not found' });
    }

    const rates_client = await rates_pool.connect()
    const builds_client = await builds_pool.connect()
    let result
    let main
    let buildIds

    switch (type) {

      case 'info':
        result = await rates_client.query('SELECT * FROM heroes WHERE hero_id = $1', [heroData.id])
        break;
        
      case 'rates':
        const rateData = await rates_client.query('SELECT * FROM rates WHERE hero_id = $1', [heroData.id])
        const mainData = await builds_client.query('SELECT * FROM main WHERE hero_id = $1', [heroData.id])
        result = { rates: rateData.rows, main: mainData.rows }
        break

      case 'builds':
        main = await builds_client.query(`SELECT * FROM main WHERE hero_id = $1 AND patch = $2`, [heroData.id, patch])
        buildIds = main.rows.map(build => build.build_id)

        console.log("Have buildIds")

        const [abilitiesData, talentsData, startingItemsData, earlyItemsData, coreItemsData] = await Promise.all([
            builds_client.query(`
              SELECT * FROM (
                  SELECT *, ROW_NUMBER() OVER (PARTITION BY build_id ORDER BY matches DESC) AS rn
                  FROM abilities
                  WHERE build_id = ANY($1::int[])
              ) AS ranked
              WHERE rn <= 10
              ORDER BY build_id, rn;
          `, [buildIds]),
      
          builds_client.query(`
              SELECT * FROM talents
              WHERE build_id = ANY($1::int[])
              ORDER BY build_id;
          `, [buildIds]),
      
          builds_client.query(`
              SELECT * FROM (
                  SELECT *, ROW_NUMBER() OVER (PARTITION BY build_id ORDER BY matches DESC) AS rn
                  FROM starting
                  WHERE build_id = ANY($1::int[])
              ) AS ranked
              WHERE rn <= 10
              ORDER BY build_id, rn;
          `, [buildIds]),
      
          builds_client.query(`
              SELECT * FROM (
                  SELECT *, ROW_NUMBER() OVER (PARTITION BY build_id ORDER BY matches DESC) AS rn
                  FROM early
                  WHERE build_id = ANY($1::int[])
              ) AS ranked
              WHERE rn <= 10
              ORDER BY build_id, rn;
          `, [buildIds]),
      
          builds_client.query(`
              SELECT * FROM (
                  SELECT *, ROW_NUMBER() OVER (PARTITION BY build_id ORDER BY matches DESC) AS rn
                  FROM core
                  WHERE build_id = ANY($1::int[])
              ) AS ranked
              WHERE rn <= 10
              ORDER BY build_id, rn;
          `, [buildIds])
        ])

        console.log("Done with all but Late")

        const coreItemsByBuildId = coreItemsData.rows.reduce((acc, item) => {
          if (!acc[item.build_id]) {
            acc[item.build_id] = [];
          }
          const arrayItem = Array.from(item.core)
          acc[item.build_id].push(arrayItem);
          return acc;
        }, {})

        const coreItemsList = buildIds.map(build_id => coreItemsByBuildId[build_id] || [])

        let queryParts = [];
        let queryParams = [];

        // Loop through each buildId and corresponding coreItemsList
        buildIds.forEach((buildId, index) => {
            const coreItemsArray = coreItemsList[index]; // Array of arrays for this buildId
            coreItemsArray.forEach((coreItems, subIndex) => {
                queryParts.push(`(build_id = $${queryParams.length + 1} AND core_items = $${queryParams.length + 2})`);
                queryParams.push(buildId, coreItems); // Push buildId and exact coreItems array
            });
        });

        // Combine the query parts with OR conditions to compare multiple core_items
        const whereCondition = queryParts.join(' OR ');

        const query = `
            SELECT * FROM (
                SELECT *, 
                    ROW_NUMBER() OVER (
                        PARTITION BY build_id, core_items, nth 
                        ORDER BY matches DESC, wins DESC
                    ) AS rn
                FROM late
                WHERE (${whereCondition})
                AND nth IN (3, 4, 5, 6, 7, 8, 9)
            ) AS ranked
            WHERE rn <= 10
            ORDER BY build_id, core_items, nth, matches DESC, wins DESC;
        `;

        const lateItemsData = await builds_client.query(query, queryParams);

        coreItemsData.rows.forEach((coreItems) => {
          const bId = coreItems.build_id
          const citems = coreItems.core
          const lateItems = lateItemsData.rows.filter(obj => obj.build_id == bId && String(obj.core_items) == String(citems))
          coreItems['late'] = lateItems
        })

        console.log("Done with Late")

        const buildData = main.rows.map(build => {        
          return {
            build_id: build.build_id,
            rank: build.rank,
            role: build.role,
            facet: build.facet,
            patch: build.patch,
            total_matches: build.total_matches,
            total_wins: build.total_wins,
            abilities: abilitiesData.rows.filter(obj => obj.build_id == build.build_id) || [],
            talents: talentsData.rows.filter(obj => obj.build_id == build.build_id) || [],
            items: {
              starting: startingItemsData.rows.filter(obj => obj.build_id == build.build_id) || [],
              early: earlyItemsData.rows.filter(obj => obj.build_id == build.build_id) || [],
              core: coreItemsData.rows.filter(obj => obj.build_id == build.build_id) || []
            }
          }
        })

        result = { builds: buildData }
        break
      
      case 'abilities':
        main = await builds_client.query(`SELECT * FROM main WHERE hero_id = $1 AND patch = $2`, [heroData.id, patch])
        buildIds = main.rows.map(build => build.build_id)

        const [abilitiesAbilities, abilitiesTalents] = await Promise.all([
          builds_client.query(`
              SELECT * FROM (
                  SELECT *, ROW_NUMBER() OVER (PARTITION BY build_id ORDER BY matches DESC) AS rn
                  FROM abilities
                  WHERE build_id = ANY($1::int[])
              ) AS ranked
              WHERE rn <= 10
              ORDER BY build_id, rn;
          `, [buildIds]),
      
          builds_client.query(`
              SELECT * FROM talents
              WHERE build_id = ANY($1::int[])
              ORDER BY build_id;
          `, [buildIds])
        ])

        const abilitiesFinal = main.rows.map(build => {
          return {
            build_id: build.build_id,
            rank: build.rank,
            role: build.role,
            facet: build.facet,
            patch: build.patch,
            total_matches: build.total_matches,
            total_wins: build.total_wins,
            abilities: abilitiesAbilities.rows.filter(obj => obj.build_id == build.build_id) || [],
            talents: abilitiesTalents.rows.filter(obj => obj.build_id == build.build_id) || []
          }
        })
        result = { abilities: abilitiesFinal }
        break

      case 'items':
        main = await builds_client.query(`SELECT * FROM main WHERE hero_id = $1 AND patch = $2`, [heroData.id, patch])
        buildIds = main.rows.map(build => build.build_id)

        const items_coreItemsData = await builds_client.query(`
            SELECT * FROM (
                SELECT *, ROW_NUMBER() OVER (PARTITION BY build_id ORDER BY matches DESC) AS rn
                FROM core
                WHERE build_id = ANY($1::int[])
            ) AS ranked
            WHERE rn <= 10
            ORDER BY build_id, rn;
        `, [buildIds])

        const items_coreItemsByBuildId = items_coreItemsData.rows.reduce((acc, item) => {
          if (!acc[item.build_id]) {
            acc[item.build_id] = [];
          }
          const arrayItem = Array.from(item.core)
          acc[item.build_id].push(arrayItem);
          return acc;
        }, {})

        const items_coreItemsList = buildIds.map(build_id => items_coreItemsByBuildId[build_id] || [])

        let items_queryParts = [];
        let items_queryParams = [];

        // Loop through each buildId and corresponding coreItemsList
        buildIds.forEach((buildId, index) => {
            const coreItemsArray = items_coreItemsList[index]; // Array of arrays for this buildId
            coreItemsArray.forEach((coreItems, subIndex) => {
                items_queryParts.push(`(build_id = $${items_queryParams.length + 1} AND core_items = $${queryParams.length + 2})`);
                items_queryParams.push(buildId, coreItems); // Push buildId and exact coreItems array
            });
        });

        // Combine the query parts with OR conditions to compare multiple core_items
        const items_whereCondition = items_queryParts.join(' OR ');

        const items_query = `
            SELECT * FROM (
                SELECT *, 
                    ROW_NUMBER() OVER (
                        PARTITION BY build_id, core_items, nth 
                        ORDER BY matches DESC, wins DESC
                    ) AS rn
                FROM late
                WHERE (${items_whereCondition})
                AND nth IN (3, 4, 5, 6, 7, 8, 9)
            ) AS ranked
            WHERE rn <= 10
            ORDER BY build_id, core_items, nth, matches DESC, wins DESC;
        `;

        const items_lateItemsData = await builds_client.query(items_query, items_queryParams);

        items_coreItemsData.rows.forEach((coreItems) => {
          const bId = coreItems.build_id
          const citems = coreItems.core
          const lateItems = items_lateItemsData.rows.filter(obj => obj.build_id == bId && String(obj.core_items) == String(citems))
          coreItems['late'] = lateItems
        })

        const itemsFinal = main.rows.map(build => {
          return {
            build_id: build.build_id,
            rank: build.rank,
            role: build.role,
            facet: build.facet,
            patch: build.patch,
            total_matches: build.total_matches,
            total_wins: build.total_wins,
            starting: startingItemsData.rows.filter(obj => obj.build_id == build.build_id) || [],
            early: earlyItemsData.rows.filter(obj => obj.build_id == build.build_id) || [],
            core: coreItemsData.rows.filter(obj => obj.build_id == build.build_id) || []
          }
        })
        result = { items: itemsFinal }
        break

      case 'matchups':
        result = await rates_client.query('SELECT * FROM matchups WHERE hero_id = $1', [heroData.id])
        break
      default:
        return res.status(400).json({ error: 'Invalid type parameter' })
    }

    builds_client.release()
    rates_client.release();
    if(type == 'builds'){res.status(200).json(result.builds)}
    if(type == 'abilities'){res.status(200).json(result.abilities)}
    if(type == 'items'){res.status(200).json(result.items)}
    else if (type == 'rates'){res.status(200).json(result)}
    else{res.status(200).json(result.rows)}
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
