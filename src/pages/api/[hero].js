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
    let result;

    switch (type) {
      case 'info':
        result = await rates_client.query('SELECT * FROM heroes WHERE hero_id = $1', [heroData.id]);
        break;
      case 'builds':
        const main = await builds_client.query(`SELECT * FROM main WHERE hero_id = $1 AND patch = $2`, [heroData.id, patch]);
        
        const buildData = await Promise.all(main.rows.map(async build => {
          const abilities = await builds_client.query('SELECT * FROM abilities WHERE build_id = $1 ORDER BY matches DESC LIMIT 10', [build.build_id]);
          const talents = await builds_client.query('SELECT * FROM talents WHERE build_id = $1', [build.build_id]);
          const startingItems = await builds_client.query('SELECT * FROM starting WHERE build_id = $1 ORDER BY matches DESC LIMIT 10', [build.build_id]);
          const earlyItems = await builds_client.query('SELECT * FROM early WHERE build_id = $1 ORDER BY matches DESC LIMIT 10', [build.build_id]);
          const coreItems = await builds_client.query('SELECT * FROM core WHERE build_id = $1 ORDER BY matches DESC LIMIT 10', [build.build_id]);
          const coreFinal = []
          for (let coreItem of coreItems.rows) {
            let m = 3
            coreItem.core.length == 3 ? m = 4 : null
            const lateItemResult = await builds_client.query(
              `SELECT * FROM (
                  SELECT *, ROW_NUMBER() OVER (PARTITION BY nth ORDER BY matches DESC, wins DESC) AS rn
                  FROM late
                  WHERE build_id = $1 AND core_items = $2 AND nth IN (3, 4, 5, 6, 7, 8, 9)
              ) AS ranked
              WHERE rn <= 10
              ORDER BY nth, matches DESC`,
              [build.build_id, coreItem.core])
            
            coreFinal.push({
              core: coreItem.core,
              wins: coreItem.wins,
              matches: coreItem.matches,
              late: lateItemResult.rows
            })
          }

          return {
            rank: build.rank,
            role: build.role,
            facet: build.facet,
            patch: build.patch,
            total_matches: build.total_matches,
            total_wins: build.total_wins,
            abilities: abilities.rows,
            talents: talents.rows,
            items: {
              starting: startingItems.rows,
              early: earlyItems.rows,
              core: coreItems,
            }
          };
        }));

        result = { builds: buildData };
        break;
      case 'rates':
        const rateData = await rates_client.query('SELECT * FROM rates WHERE hero_id = $1', [heroData.id]);
        const mainData = await builds_client.query('SELECT * FROM main WHERE hero_id = $1', [heroData.id])
        result = { rates: rateData.rows, main: mainData.rows }
        break;
      case 'matchups':
        result = await rates_client.query('SELECT * FROM matchups WHERE hero_id = $1', [heroData.id]);
        break;
      default:
        return res.status(400).json({ error: 'Invalid type parameter' });
    }

    builds_client.release()
    rates_client.release();
    if(type == 'builds'){res.status(200).json(result.builds)}
    else if (type == 'rates'){res.status(200).json(result)}
    else{res.status(200).json(result.rows)}
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
