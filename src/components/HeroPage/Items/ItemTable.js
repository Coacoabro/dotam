import React, { useState, useEffect } from 'react';

import ItemRow from './ItemRow';



function ItemTable(items) {

    const [currentSort, setCurrentSort] = useState("PR");
    const [sortBy, setSortBy] = useState("f2l");
    const [itemList, setItemList] = useState([{}]);
    const [displayCount, setDisplayCount] = useState(5); // Initial display count

    const handleSortClick = (sort) => {
        if (sort !== currentSort) {
            setCurrentSort(sort);
            setDisplayCount(5); // Reset display count when sorting changes
        } else {
            setSortBy(prevSort => prevSort === "f2l" ? "l2f" : "f2l");
        }
    };

    useEffect(() => {
        let itemsByRR = [...items.items]; // Assuming items is available in scope

        if (sortBy === "f2l") {
            itemsByRR.sort((a, b) => b[currentSort] - a[currentSort]);
        } else if (sortBy === "l2f") {
            itemsByRR.sort((a, b) => a[currentSort] - b[currentSort]);
        }

        setItemList(itemsByRR.slice(0, displayCount)); // Set itemList with sliced itemsByRR
    }, [currentSort, sortBy, displayCount, items]); // Add displayCount to dependency array

    const handleShowMore = () => {
        // Increment display count by 5 when "Show More" button is clicked
        setDisplayCount(prevCount => prevCount + 5);
    };

    return (
        <div>
            <table className="table-auto">
                <thead className="sticky">
                    <tr className="bg-gray-800 text-white h-10">
                        <th className="px-3">
                            <button className={`${currentSort === "Time" ? "underline" : null} hover:underline`} onClick={() => handleSortClick("Time")}>TIME⇅</button>
                        </th>
                        <th className="px-2 w-20">ITEM</th>
                        <th className="px-5">
                            <button className={`${currentSort === "WR" ? "underline" : null} hover:underline`} onClick={() => handleSortClick("WR")}>WR⇅</button>
                        </th>
                        <th className="px-5">
                            <button className={`${currentSort === "PR" ? "underline" : null} hover:underline`} onClick={() => handleSortClick("PR")}>PR⇅</button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {itemList.map((item, index) => (
                        <ItemRow key={index} item={item} index={index} />
                    ))}
                </tbody>
            </table>
            {/* Show "Show More" button if there are more items to display */}
            {itemList.length < items.items.length && (
                <button className="text-white text-lg hover:underline" onClick={handleShowMore}>Show More</button>
            )}
        </div>
    );
}

export default ItemTable