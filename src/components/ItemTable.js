import React, { useState, useEffect } from 'react';

import ItemRow from './ItemRow';



function ItemTable(items) {

    const [currentSort, setCurrentSort] = useState("Time");
    const [sortBy, setSortBy] = useState("f2l");
    const [itemList, setItemList] = useState([{}]);

    const handleSortClick = (sort, currentSort) => {
        if (sort == currentSort) {
            if (sortBy === "f2l") {
                setSortBy("l2f")
            } else if (sortBy === "l2f") {
                setSortBy("f2l")
            }
        }
        else {setCurrentSort(sort)}
    };

    useEffect(() => {
        let itemsByRR = [];

        if (sortBy === "f2l") {
            setItemList(itemsByRR = items.items.sort((a, b) => b[currentSort] - a[currentSort]))
        }
        else if (sortBy === "l2f") {
            setItemList(itemsByRR = items.items.sort((a, b) => a[currentSort] - b[currentSort]))
        }
        
    
    }, [currentSort, sortBy, items]);



    return(
        <div>
            <table class="table-auto">
                <thead>
                    <tr className="bg-gray-700 text-white">
                        <th className="px-2">
                            <button onClick={() => handleSortClick("Time", currentSort)}>TIME⇅</button>
                        </th>
                        <th className="px-2 w-20">ITEM</th>
                        <th className="px-5">
                            <button onClick={() => handleSortClick("WR", currentSort)}>WR⇅</button>
                        </th>
                        <th className="px-5">
                            <button onClick={() => handleSortClick("PR", currentSort)}>PR⇅</button>
                        </th>
                        <th className="px-2">
                            <button onClick={() => handleSortClick("Matches", currentSort)}>MATCHES⇅</button>
                        </th>
                    </tr>
                    {itemList.map((item, index) => (
                        <ItemRow item={item} index={index}/>
                    ))}
                </thead>
            </table>
        </div>
    )
}

export default ItemTable