import React from 'react';

import Item from '../../Item';



function BuildRow({build, pr, wr, matches}) {
    
    return(
        <tr className={`bg-gray-700 text-white h-16 items-center`}>
            <td className="flex">
                <Item id={build[0]} width={16} />
                <Item id={build[1]} width={16} />
                <Item id={build[2]} width={16} />
            </td>
            <td>{wr}%</td>
            <td>
                <h1>{pr}%</h1>
                <h2 className='text-xs'>{matches}</h2>
            </td>
        </tr>
    )

    
}

export default BuildRow