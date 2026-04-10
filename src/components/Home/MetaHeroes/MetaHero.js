import Item from "../../../components/HeroPage/Item"
import json from "../../../../json/Role"
import Link from "next/link"
import { useState } from "react"

export default function MetaHero( {role, heroData} ) {

    const [entered,setEntered] = useState(false)

    const wr = heroData.wr
    const currentRole = json.find(item => item.role === role)

    const heroName = heroData.name
    const heroImg = 'https://cdn.cloudflare.steamstatic.com' + heroData.img
    const heroURL = heroData.url

    const core = heroData.core


    return(
        <div className="w-[234px]">
            <Link href={`/hero/${heroURL}/builds`} onMouseEnter={()=>setEntered(true)} on onMouseLeave={()=>setEntered(false)}>
                <div className="flex-cols justify-center rounded-2xl bg-gradient-to-b from-[#1E2439] to-[#0B0D1C] p-4 pb-0 space-y-[12px] ">
                    <div className="flex justify-between">
                        <img src={heroImg} className="w-[74px] rounded-lg border border-[#627594]" />
                        <div className="bg-slate-700 p-[10px] rounded-xl">
                            <img src={currentRole.icon} className="w-[24px]" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-[12px] opacity-50 h-[16px]">
                            <p>{currentRole.name}</p>
                            <p>Win Rate</p>
                        </div>
                        <div className="flex justify-between font-medium text-[12px] h-[24px]">
                            <p>{heroName}</p>
                            <p className="text-[#64C15B] font-bold">{wr}%</p>
                        </div>
                    </div>
                    <div className={`text-center font-semibold mx-auto w-[87px] text-[10px]/[12px] tracking-tight rounded-t-xl bg-gradient-to-b from-[#40485566] to-[#404855] px-[8px] py-2`}>
                        Core Item Build
                    </div>
                </div>
            </Link>
            
            
            <div className={`rounded-b-xl flex justify-center bg-[#0B0D1CCC] w-[194px] mx-auto transition-transform-all duration-300 ${entered ? "pt-2 pb-1" : "h-0"} `}>
                {core.map((id, key) => (
                    <div className={`items-center flex ${entered ? "" : "hidden"}`}>
                        <div className="w-[50px]">
                            <Item id={id} />
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`-mt-2 w-3 h-3 ${key==(core.length-1) ? "hidden":""}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>
                ))}
            </div>
        </div>
    )
}