import Item from '../../Item'

export default function ItemCard({item, index}) {

    const order = ['1st', '2nd', '3rd', '4th', '5th', '6th']

    const itemId = item.Item || item.Boots

    const wr = ((item.Wins/item.Matches)*100).toFixed(1)
    const matches = (item.Matches).toLocaleString()

    return(
        <div className='flex gap-3 items-end'>
            {/* {index >= 0 ? <div className='text-lg font-bold'>{index + 1}.</div> : null} */}
            <div className='flex gap-2.5 items-center'>
                <div className='w-16'>
                    <Item id={itemId} />
                    <div className='absolute -mt-5 w-full ml-8'>{item.isSecondPurchase ? <div>2nd</div> : null}</div>
                </div>
                
                <div>
                    <div className='flex items-center gap-1'>
                        <h1 className='text-lg'>{wr}%</h1>
                        <h2 className='opacity-50 text-sm'>WR</h2>
                    </div>
                    <div className='opacity-50 text-sm'>
                        ({matches} Matches)
                    </div>
                </div>
            </div>
        </div>
    )
}