import { useState } from "react"

export default async function handler(req, res) {
  const { hero, type, page, patch, rank } = req.query

  try {

    let result
    let lastModified

    switch (type) {

      case 'page':
        if(page != 'matchups'){
          const page_res = await fetch(`https://d3b0g9x0itdgze.cloudfront.net/data/${patch}/${hero}/${rank}/${page}.json`)
          result = await page_res.json()
          lastModified = page_res.headers.get("last-modified")
        }
        else{result = null}
        
        break

      case 'matchups':
        const matchups_res = await fetch(`https://dhpoqm1ofsbx7.cloudfront.net/data/${patch.replace(".", "_")}/${hero}/matchups.json`)
        result = await matchups_res.json()
        lastModified = matchups_res.headers.get("last-modified")
        break

      default:
        return res.status(400).json({ error: 'Invalid type parameter' })
    }

    res.status(200).json({
      data: result,
      modified: lastModified
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
