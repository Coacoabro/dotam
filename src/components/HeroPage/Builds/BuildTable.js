import React, { useState, useEffect } from 'react';

import BuildRow from './BuildRow';
import Item from '../../Item'


function BuildTable(builds) {

    const tempBuilds = builds.builds

    const sortedBuilds = tempBuilds.sort((a, b) => b["Matches"] - a["Matches"])

    const [displayCount, setDisplayCount] = useState(1);

    const handleShowMore = () => {
        setDisplayCount(prevCount => prevCount + 5);
    };
    const handleShowLess = () => {
        setDisplayCount(1);
    };

    return (
        <div>
            <table className="table-auto">
                <thead className="sticky">
                    <tr className="bg-gray-800 text-white h-10">
                        <th className="px-2">CORE ITEMS</th>
                        <th className="px-5">WR</th>
                        <th className="px-5">PR</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedBuilds.slice(0, displayCount).map((build, index) => (
                        <tr className={`bg-gray-700 text-white items-center hover:bg-gray-600`}>
                            <td className="flex px-1">
                                <Item id={build.Core[0]} width={16} />
                                <Item id={build.Core[1]} width={16} />
                                {build.Core[2] ? <Item id={build.Core[2]} width={16} /> : null}
                            </td>
                            
                            <td className="px-2">{build.WR}%</td>
                            <td className="px-2">
                                <h1>{build.PR}%</h1>
                                <h2 className='text-xs'>{build.Matches}</h2>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {displayCount < sortedBuilds.length ? (
                <button className="text-white text-lg hover:underline" onClick={handleShowMore}>Show More</button>
            ) : 
                <button className="text-white text-lg hover:underline" onClick={handleShowLess}>Show Less</button>}
        </div>
    );
    
}

export default BuildTable