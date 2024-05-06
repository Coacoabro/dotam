import React from 'react'
import Item from '../../Item'

function ItemOrderTable({items, order, matches}) {
    if(items.length > 0){

        items.sort((a, b) => b.Matches - a.Matches)

        return(
            <div className='text-white text-xl bg-gray-700 rounded-md space-y-2'>
            <h1>{order == "3" ? `${order}rd` : `${order}th`}</h1> 
            <div className='space-y-1'>
            {items.slice(0, 3).map((item) => (
            <div>
                <Item id={item.Item} width={12} />
                <div>
                    <h1 className='text-sm'>{((item.Wins/item.Matches)*100).toFixed(0)}%</h1>
                    <h2 className="text-xs">{(item.Matches).toLocaleString()}</h2>
                </div>
            </div>
            ))}
            </div>
            
            </div>
        )
    }
    
}

export default ItemOrderTable