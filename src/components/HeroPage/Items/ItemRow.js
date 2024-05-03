import React from 'react';
import Item from '../../Item';



function ItemRow({item, index}) {

    if(item.Time && item.Matches) {
        const time = item.Time.toFixed(0)
        const matches = item.Matches.toLocaleString()
        if((item.PR >= 15 && time <=30) || (item.PR > 7 && time > 30)) {
            return(
                <tr className={`bg-gray-700 text-white h-16`}>
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
        
    }

    else {return null}
    
}

export default ItemRow