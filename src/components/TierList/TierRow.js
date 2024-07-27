import React, { useState, useEffect } from 'react';
import Link from 'next/link'

import Role from '../../../json/Role.json'
import heroConstants from '../../../dotaconstants/build/heroes.json';
import dota2heroes from '../../../json/dota2heroes.json'

export default function TierRow({ tier_str, role, hero, WR, PR, matches, counters, index }){

    const [fiveCounters, setFiveCounters] = useState([]);
    const [roleImage, setRoleImage] = useState('');
    const [roleName, setRoleName] = useState('');
    const [hovered, setHovered] = useState(false);

    const tierColor = {
        "S+": "text-[#F4B856]", 
        "S": "text-[#7879DE]", 
        "A": "text-[#ABDEED]", 
        "B": "text-slate-200", 
        "C": "text-[#FCA5A5]", 
        "D": "text-[#F46E58]", 
        "F": "text-[#E8624C]"
    }
    
    const [wrColor, setWRColor] = useState("text-slate-200")

    useEffect(() => {
        if(WR > 0.55) {
            setWRColor("text-[#F4B856]")
        }
        else if (WR > 0.525) {
            setWRColor("text-[#7879DE]")
        }
        else if (WR > 0.515) {
            setWRColor("text-[#ABDEED]")
        }
        else if (WR > 0.485) {
            setWRColor("text-slate-200")
        }
        else if (WR > 0.475) {
            setWRColor("text-[#FCA5A5]")
        }
        else{
            setWRColor("text-[#F46E58]")
        }


    }, [WR])
    

    useEffect(() => {
        if (role) {
            const roleImage = Role.find(r => r.role === role).icon;
            const roleName = Role.find(r => r.role === role).name;
            setRoleImage(roleImage);
            setRoleName(roleName);
        }
        if (counters) {
        const heroCounters = counters.herovs;
        const reverseCounters = heroCounters.slice(-5).reverse();
        const finalCounters = reverseCounters.map(hero => hero.Hero);
        setFiveCounters(finalCounters);
        }
    }, [counters, role]);

    const showTooltip = (event) => {
        const tooltip = event.target.nextElementSibling;
        tooltip.style.visibility = 'visible';
    };
    
    const hideTooltip = (event) => {
        const tooltip = event.target.nextElementSibling;
        tooltip.style.visibility = 'hidden';
    };

    if (!hero) return null;

    const heroURL = dota2heroes.find(r => r.id == hero.hero_id)?.url

    const heroName = hero.localized_name;
    const img = 'https://cdn.cloudflare.steamstatic.com' + hero.img;

    return (
        <tr className={`text-white font-normal ${index % 2 === 1 ? 'bg-slate-800' : 'bg-slate-900'}`}>
            <td className={`${tierColor[tier_str]} text-sm sm:text-xl font-medium`}>{tier_str}</td>
            <td className="py-1 py-2">
                <Link href={`/hero/${heroURL}`}>
                    <div className="w-48 sm:w-72 flex items-center text-left space-x-2 sm:space-x-4 hover:underline">
                        <div className="w-14 sm:w-20" >
                            <img src={img} />
                        </div>
                        <div className="font-normal text-sm sm:text-xl whitespace-nowrap truncate">
                            {heroName}
                        </div>
                    </div>
                </Link>
            </td>
            <td className="px-4 sm:px-2" ><img className="w-5 sm:w-8" src={roleImage} title={roleName} /></td>
            <td className={`px-2 sm:px-0 font-medium text-sm sm:text-lg ${wrColor}`}>{(WR * 100).toFixed(2)}%</td>
            <td className={`px-2 sm:px-0 text-sm sm:text-lg`}>{(PR * 100).toFixed(2)}%</td>
            <td className="text-sm sm:text-lg">{matches.toLocaleString()}</td>
            <td>
                <div className="hidden lg:flex items-center justify-evenly">
                {fiveCounters.map(hero => (
                    <Link href={`/hero/${dota2heroes.find(r => r.id == hero)?.url}`}>                        
                        <img
                            className="w-10 h-full rounded-full"
                            src={hero ? `https://dhpoqm1ofsbx7.cloudfront.net/hero_thumbnail/${heroConstants[hero].name}` + '.jpg' : null}
                            title={heroConstants[hero].localized_name}
                        />
                    </Link>
                ))}
                </div>
            </td>
        </tr>
    );
}