import { useState, useEffect } from "react"

import AbilityRow from "./AbilityRow";

export default function AbilityPath(abilities) {

    console.log(abilities)

    const allAbilities = abilities.abilities.sort((a, b) => b["Matches"] - a["Matches"])
    const topAbilities = allAbilities.slice(0, 10)


    return(
        <div className="overflow-x-auto mx-auto custom-scrollbar bg-slate-950 rounded-lg shadow border border-slate-800 pb-4 h-[500px]">
            <table className="table-auto text-slate-200 font-medium font-['Inter'] font-sans leading-tight text-xl">
                <tr className="border-b-2 border-slate-800">
                    <th className="text-left px-8 py-3 w-2/3">
                        Ability Path Order
                    </th>
                    <th className="w-1/12">
                        <button className=" flex items-center py-3">WR</button>
                    </th>
                    <th className="w-1/12">
                        <button className="flex items-center py-3">Matches</button>
                    </th>
                </tr>
                <tbody className="text-lg">
                    {abilities.abilities.map((obj, index) => (
                        <AbilityRow order={index} abilityPath={obj.abilities} matches={obj.matches} wins={obj.wins} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}