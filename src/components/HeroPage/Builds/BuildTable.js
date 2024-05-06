import React, { useState, useEffect } from 'react';

import BuildRow from './BuildRow';
import Item from '../../Item'


function BuildTable(builds) {

    const tempBuilds = builds.builds

    const sortedBuilds = tempBuilds.sort((a, b) => b["Matches"] - a["Matches"])

    const [displayCount, setDisplayCount] = useState(1);
    const [showBuild, setShowBuild] = useState(-1)

    const handleShowMore = () => {
        if(displayCount == 1){
            setDisplayCount(prevCount => prevCount + 2);
        } else {
            setDisplayCount(prevCount => prevCount + 3);
        }
        setShowBuild(-1)
    };
    const handleShowLess = () => {
        setDisplayCount(1);
        setShowBuild(-1)
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
                {showBuild < 0 ? (
                    <tbody>
                        {sortedBuilds.slice(0, displayCount).map((build, index) => (
                            <tr className={`bg-gray-700 text-white items-center hover:bg-gray-600`} onClick={() => setShowBuild(index)}>
                                <td className="flex px-1">
                                    <Item id={build.Core[0]} width={20} />
                                    <Item id={build.Core[1]} width={20} />
                                    {build.Core[2] ? <Item id={build.Core[2]} width={20} /> : null}
                                </td>
                                
                                <td className="px-2 className='text-sm'">{build.WR}%</td>
                                <td className="px-2">
                                    <h1 className='text-sm'>{build.PR}%</h1>
                                    <h2 className='text-xs'>{build.Matches}</h2>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                ) : 
                    <tbody>
                        <tr className='bg-gray-700 text-white items-center'>
                            <td className='flex px-1'>
                                <Item id={sortedBuilds[showBuild].Core[0]} width={20} />
                                <Item id={sortedBuilds[showBuild].Core[1]} width={20} />
                                {sortedBuilds[showBuild].Core[2] ? <Item id={sortedBuilds[showBuild].Core[2]} width={20} /> : null}
                            </td>
                            <td className="px-2 className='text-sm'">{sortedBuilds[showBuild].WR}%</td>
                            <td className="px-2">
                                <h1 className='text-sm'>{sortedBuilds[showBuild].PR}%</h1>
                                <h2 className='text-xs'>{sortedBuilds[showBuild].Matches}</h2>
                            </td>
                        </tr>
                    </tbody>

                }
            </table>
            {displayCount < sortedBuilds.length ? (
                <button className="text-white text-lg hover:underline" onClick={handleShowMore}>Show More</button>
            ) : sortedBuilds.length != 1 ? ( 
                <button className="text-white text-lg hover:underline" onClick={handleShowLess}>Show Less</button>
            ) : null}
        </div>
    );
    
}

export default BuildTable