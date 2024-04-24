import React from 'react';
import Item from './Item';



function ItemRow({item, index}) {

    if(item.Time && item.Matches) {
        const time = item.Time.toFixed(0)
        const matches = item.Matches.toLocaleString()

        return(
            <tr className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'} text-white h-16`}>
                <td>~{time} min</td>
                <td><Item id={item.Item} /></td>
                <td>{item.WR}%</td>
                <td>
                    {item.PR}%
                    <h1 className="text-xs">{matches}</h1>
                </td>
            </tr>
        )
    }

    else {return null}
    
}

export default ItemRow