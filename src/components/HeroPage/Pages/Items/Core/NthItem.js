import Item from '../../../Item'

export default function NthItem({item}){

    const wr = ((item.wins/item.matches)*100).toFixed(1)
    const matches = (item.matches).toLocaleString()

    return(
        <div className='w-20 truncate text-center'>
            <Item id={item.item} />
            <div>
                <div>{wr}% <span className='text-sm'>WR</span></div>
                <div className='text-xs'>{matches} Matches</div>
            </div>
        </div>
    )
}