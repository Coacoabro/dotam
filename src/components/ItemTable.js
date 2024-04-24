import React, { useState, useEffect } from 'react';

import ItemRow from './ItemRow';



function ItemTable(items) {

    const [currentSort, setCurrentSort] = useState("PR");
    const [sortBy, setSortBy] = useState("f2l");
    const [itemList, setItemList] = useState([{}]);

    const handleSortClick = (sort, currentSort) => {

        console.log(sort, currentSort)

        if (sort !== currentSort) 
            {
                setCurrentSort(sort)
            }
        else {
            if (sortBy === "f2l") {
                setSortBy("l2f")
            } else if (sortBy === "l2f") {
                setSortBy("f2l")
            }
        }
    };

    
    

    useEffect(() => {
        let itemsByRR = [];
    
        if (sortBy === "f2l") {
            setItemList(itemsByRR = [...items.items].sort((a, b) => b[currentSort] - a[currentSort]))
        }
        else if (sortBy === "l2f") {
            setItemList(itemsByRR = [...items.items].sort((a, b) => a[currentSort] - b[currentSort]))
        }
    
    }, [currentSort, sortBy, items]);



    return(
        <div className="overflow-auto max-h-60">
            <table class="table-auto">
                <thead className="sticky">
                    <tr className="bg-gray-700 text-white h-10">
                        <th className="px-3">
                            <button onClick={() => handleSortClick("Time", currentSort)}>TIME⇅</button>
                        </th>
                        <th className="px-2 w-20">ITEM</th>
                        <th className="px-5">
                            <button onClick={() => handleSortClick("WR", currentSort)}>WR⇅</button>
                        </th>
                        <th className="px-5">
                            <button onClick={() => handleSortClick("PR", currentSort)}>PR⇅</button>
                        </th>
                        <th className="px-3">
                            MATCHES
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {itemList.map((item, index) => (
                        <ItemRow item={item} index={index}/>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ItemTable