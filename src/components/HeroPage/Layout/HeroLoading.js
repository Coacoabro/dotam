import LoadingWheel from "../../LoadingWheel"
import Pages from "../../Pages"
import OptionsContainer from "./OptionsContainer"
import RatesContainer from "./Rates/RatesContainer"
import StaticInfo from "./Static/StaticInfo"

export default function HeroLoading({hero, heroData, rates, current_patch, initRole}){

    const heroName = hero.name

    const portrait = 'https://cdn.cloudflare.steamstatic.com' + heroData.img
    const crop_img = 'https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/crops/' + heroData.name.replace('npc_dota_hero_', '') + '.png'

    return(
        <div className="px-1 sm:px-4 sm:pt-14 sm:mx-auto sm:max-w-7xl space-y-2 sm:space-y-0">

            <div className="flex relative items-end sm:items-center gap-1 sm:gap-4">

            <img src={portrait} className="h-14 sm:h-32" />

            <div className="sm:py-7 sm:px-2 flex-col space-y-2 z-20 sm:z-40">
                <div className="text-2xl sm:text-5xl font-bold ml-2">{heroName}</div>
                <div className="hidden sm:block"><StaticInfo hero={heroData} /></div>
            </div>

            <div className="hidden sm:flex absolute right-0 mt-20 h-72 opacity-25 z-0">
                <img src={crop_img} className="object-cover w-full h-full" />
            </div>

            </div>

            <div className="sm:hidden absolute h-36 right-0 top-16 opacity-25">
                <img src={crop_img} className="object-cover w-full h-full" />
            </div>

            <div className="block sm:hidden z-10">
                <StaticInfo hero={heroData} />
            </div>

            <div className="flex space-x-3">
                <RatesContainer rates={rates} initRole={initRole} current_patch={current_patch} />
                <div className='hidden sm:block'>
                    <h1 className='font-bold px-2 pb-2'>More Info:</h1>
                    <Pages hero={hero.url} />
                </div>
            </div>

            <div className='py-3 z-0 px-0 sm:px-32 lg:px-0'>
                <OptionsContainer hero={hero} />
            </div>

            <div className="hidden sm:block"><LoadingWheel /></div>
        </div>
    )
}