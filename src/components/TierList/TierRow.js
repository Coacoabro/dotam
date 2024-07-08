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

    const tierColor = {"S+": "text-yellow-400", "S": "text-indigo-600", "A": "text-indigo-300", "B": "text-white", "C": "text-red-100", "D": "text-red-300", "F": "text-red-700"}
    const [wrColor, setWRColor] = useState("text-slate-200")

    useEffect(() => {
        if(WR > 0.55) {
            setWRColor("text-yellow-400")
        }
        else if (WR > 0.525) {
            setWRColor("text-indigo-600")
        }
        else if (WR > 0.505) {
            setWRColor("text-indigo-300")
        }
        else if (WR > 0.495) {
            setWRColor("text-slate-200")
        }
        else if (WR > 0.475) {
            setWRColor("text-red-300")
        }
        else{
            setWRColor("text-red-700")
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
            <td className={`px-6 py-2 ${tierColor[tier_str]} text-lg font-medium`}>{tier_str}</td>
            <td className="px-1 py-2">
                <Link href={`/hero/${heroURL}`}>
                <div className="flex items-center text-left space-x-4 hover:underline">
                    <div className="w-20">
                    <img src={img} />
                    </div>
                    <div className="font-normal">{heroName}</div>
                </div>
                </Link>
            </td>
            <td className="px-4 py-2 justify-items-center"><img className="w-8" src={roleImage} title={roleName} /></td>
            <td className={`px-4 py-2 font-medium ${wrColor}`}>{(WR * 100).toFixed(2)}%</td>
            <td className={`px-4 py-2`}>{(PR * 100).toFixed(2)}%</td>
            <td className="px-2 py-2">
                <div className="flex items-center justify-center space-x-2">
                {fiveCounters.map(hero => (
                    <Link href={`/hero/${dota2heroes.find(r => r.id == hero)?.url}`}>                        
                        <img
                            className="w-8 h-full rounded-full"
                            src={hero ? `https://dhpoqm1ofsbx7.cloudfront.net/hero_thumbnail/${heroConstants[hero].name}` + '.jpg' : null}
                            title={heroConstants[hero].localized_name}
                        />
                    </Link>
                ))}
                </div>
            </td>
            <td className="px-4 py-3">{matches.toLocaleString()}</td>
        </tr>
    );
}