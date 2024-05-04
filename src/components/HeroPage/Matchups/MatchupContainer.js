import React, { useState, useEffect } from 'react';
import Link from 'next/link'

import heroName from '../../../../dotaconstants/build/heroes.json'

function MatchupContainer({ vs, heroes }) {
    const [sortedHeroes, setSortedHeroes] = useState([]);
    const [displayCount, setDisplayCount] = useState(10);
    const [sortBy, setSortBy] = useState("WR");
    const [sortOrder, setSortOrder] = useState("desc");

    useEffect(() => {
        // Sort heroes based on the current sort criteria
        const sorted = [...heroes].sort((a, b) => {
            const factor = sortOrder === "asc" ? 1 : -1;
            if (a[sortBy] < b[sortBy]) return -1 * factor;
            if (a[sortBy] > b[sortBy]) return 1 * factor;
            return 0;
        });
        setSortedHeroes(sorted);
    }, [heroes, sortBy, sortOrder]);

    const handleSortChange = (criteria) => {
        if (criteria === sortBy) {
            // Toggle sort order if the same criteria is clicked again
            setSortOrder(order => (order === "asc" ? "desc" : "asc"));
        } else {
            // Set new sort criteria
            setSortBy(criteria);
            // Reset sort order to descending by default
            setSortOrder("desc");
        }
        // Reset display count when sorting changes
        setDisplayCount(10);
    };

    const handleShowMore = () => {
        // Increment display count by 20 when "Show More" button is clicked
        setDisplayCount(prevCount => prevCount + 20);
    };

    return (
        <div className="bg-gray-600 p-3 rounded-md text-center">
            <div className="text-xl">{vs}</div>
            <table className="w-full">
                <thead className="bg-gray-800 text-white text-xl">
                    <tr>
                        <th className="px-3 py-2">Hero</th>
                        <th onClick={() => handleSortChange("WR")} className="cursor-pointer hover:underline">WR⇅</th>
                        <th className="px-3 py-2">Matches</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {sortedHeroes.slice(0, displayCount).map((hero, index) => (
                        <tr key={index} className="bg-gray-700 text-lg">
                            <td className="px-3 py-2">
                                <Link href={`/hero/${hero.Hero}`}>
                                    <img
                                        className="w-24"
                                        src={`https://cdn.cloudflare.steamstatic.com${heroName[hero.Hero].img}`}
                                        title={heroName[hero.Hero].localized_name}
                                    />
                                </Link>
                            </td>
                            <td className="px-3 py-2">{hero.WR}%</td>
                            <td className="px-3 py-2">{hero.Matches.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Show "Show More" button if there are more items to display */}
            {sortedHeroes.length > displayCount && (
                <button className="text-white text-lg hover:underline" onClick={handleShowMore}>Show More</button>
            )}
        </div>
    );
}



export default MatchupContainer