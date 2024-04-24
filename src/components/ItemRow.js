import React from 'react';
import Item from './Item';



function ItemRow({item, index}) {
    const time = item.Time.toFixed(2)
    const matches = item.Matches.toLocaleString()

    return(
        <tr className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'} text-white`}>
            <td>~{item.Time} min</td>
            <td><Item id={item.Item} /></td>
            <td>{item.WR}%</td>
            <td>{item.PR}%</td>
            <td>{matches}</td>
        </tr>
    )
}

export default ItemRow