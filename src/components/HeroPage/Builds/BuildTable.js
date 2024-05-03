import React, { useState, useEffect } from 'react';

import BuildRow from './BuildRow';


function BuildTable(builds) {

    const tempBuilds = builds.builds

    const sortedBuilds = tempBuilds.sort((a,b) => {b.WR - a.WR})

    console.log(sortedBuilds)

    return(
        <table class="table-auto">
            <thead className="sticky">
                <tr className="bg-gray-800 text-white h-10">
                    <th className="px-2">CORE ITEMS</th>
                    <th className="px-5">WR</th>
                    <th className="px-5">PR</th>
                </tr>
            </thead>
            <tbody>
                {sortedBuilds.map((build) => (
                    <BuildRow build={build.Core} pr={build.PR} wr={build.WR} matches={build.Matches} />
                ))}
            </tbody>
        </table>
    )
}

export default BuildTable