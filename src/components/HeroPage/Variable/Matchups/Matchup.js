import Link from 'next/link'

import Heroes from '../../../../../dotaconstants/build/heroes.json'
import dota2heroes from '../../../../../json/dota2heroes.json'

export default function Matchup({matchup}){

    const heroName = Heroes[matchup.Hero].localized_name
    const heroImage =  `https://dhpoqm1ofsbx7.cloudfront.net/hero_thumbnail/${Heroes[matchup.Hero].name}` + '.jpg'
    const heroURL = dota2heroes.find((hero) => hero.id == matchup.Hero)?.url

    return(
        <div className='h-36 w-24 sm:w-28 py-2.5 px-2 sm:px-0 bg-slate-950 rounded-lg border border-slate-800 text-indigo-300 flex-col'>
            <div className='text-center text-xs sm:text-sm font-bold sm:space-y-2'>
                <h1 className='whitespace-nowrap truncate'>{heroName}</h1>
                <Link href={'/hero/' + heroURL}>
                    <img className="py-2 w-9 sm:w-12 h-full mx-auto rounded-full" src={heroImage} />
                </Link>
            </div>
            <div className=''>
                <div className='flex space-x-1 items-end justify-center'>
                    <h1 className='text-xs sm:text-base text-slate-200 font-normal'>{matchup.WR}%</h1>
                    <h2 className='text-2xs sm:text-xs opacity-75'>WR</h2>
                </div>
                <div className='text-2xs sm:text-xs flex justify-center opacity-75 text-center'>{matchup.Matches.toLocaleString()} Matches</div>
            </div>
        </div>
    )
}