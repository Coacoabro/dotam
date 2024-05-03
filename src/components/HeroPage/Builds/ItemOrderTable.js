import React from 'react'

function ItemOrderTable({items, order}) {

    console.log(items)

    return(
        <div className='text-white text-xl bg-gray-700 p-2 rounded-md'>
            {order}
        </div>
    )
}

export default ItemOrderTable