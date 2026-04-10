import { useState, useEffect } from "react"

import AbilityRow from "./AbilityRow";

export default function AbilityPath(abilities) {

    return(
        <div className="overflow-x-auto mx-auto custom-scrollbar bg-slate-950 rounded-lg shadow border border-slate-800 pb-4 sm:h-[500px]">
            <table className="table-auto w-full text-slate-200 font-medium font-['Inter'] font-sans leading-tight text-sm sm:text-xl">
                <tr className="border-b-2 border-slate-800 text-[#6C7A8E] text-[13px]/[20px]">
                    <th className="text-left px-4 py-2 sm:w-2/3">
                        Ability Path Order
                    </th>
                    <th className="sm:w-1/12">
                        <button className=" py-2 text-center">WR</button>
                    </th>
                    <th className="sm:w-1/12">
                        <button className="text-center py-2">Matches</button>
                    </th>
                </tr>
                <tbody className="text-lg">
                    {abilities.abilities.map((obj, index) => (
                        <AbilityRow order={index} abilityPath={obj.Abilities} matches={obj.Matches} wins={obj.Wins} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}