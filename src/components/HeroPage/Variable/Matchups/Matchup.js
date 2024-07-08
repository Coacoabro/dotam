import Link from 'next/link'

import Heroes from '../../../../../dotaconstants/build/heroes.json'
import dota2heroes from '../../../../../json/dota2heroes.json'

export default function Matchup({matchup}){

    const heroName = Heroes[matchup.Hero].localized_name
    const heroImage =  `https://dhpoqm1ofsbx7.cloudfront.net/hero_thumbnail/${Heroes[matchup.Hero].name}` + '.jpg'
    const heroURL = dota2heroes.find((hero) => hero.id == matchup.Hero)?.url

    return(
        <div className='h-44 space-y-5 py-2.5 bg-slate-950 rounded-lg border border-slate-800 text-indigo-300 w-full flex-col'>
            <div className='text-center text-sm font-bold space-y-2'>
                <h1 className='h-9'>{heroName}</h1>
                <Link href={'/hero/' + heroURL}>
                    <img className="w-12 h-full mx-auto rounded-full" src={heroImage} />
                </Link>
            </div>
            <div className='space-y-1 '>
                <div className='h-[1px] w-1/2 bg-slate-400 mx-auto' />
                <div className='flex space-x-1 items-end justify-center'>
                    <h1 className='text-slate-200 font-normal'>{matchup.WR}%</h1>
                    <h2 className='text-xs opacity-75'>WR</h2>
                </div>
                <div className='text-xs flex justify-center opacity-75'>{matchup.Matches.toLocaleString()} Matches</div>
            </div>
        </div>
    )
}