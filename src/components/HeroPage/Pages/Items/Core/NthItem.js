import Item from '../../../Item'

export default function NthItem({item}){

    const wr = ((item.wins/item.matches)*100).toFixed(1)
    const matches = (item.matches).toLocaleString()

    return(
        <div className='w-20 truncate text-center text-xs sm:text-base'>
            <Item id={item.item} />
            <div>
                <div>{wr}% <span className='sm:text-sm'>WR</span></div>
                <div className='text-2xs sm:text-xs'>{matches} Matches</div>
            </div>
        </div>
    )
}