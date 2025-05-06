import Item from '../../../Item'

export default function NthItem({item}){


    const wr = ((item.Wins/item.Matches)*100).toFixed(1)
    const matches = (item.Matches).toLocaleString()

    return(
        <div className='w-20 truncate text-center text-xs sm:text-base'>
            <Item id={item.Item} />
            <div>
                <div>{wr}% <span className='sm:text-sm'>WR</span></div>
                <div className='text-2xs sm:text-xs'>{matches} Matches</div>
            </div>
        </div>
    )
}