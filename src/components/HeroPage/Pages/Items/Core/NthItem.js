import Item from '../../../Item'

export default function NthItem({item}){


    const wr = ((item.Wins/item.Matches)*100).toFixed(1)
    const matches = (item.Matches).toLocaleString()

    return(
        <div className='w-20 truncate text-center text-[14px]/[20px] '>
            <Item id={item.Item} />
            <div>
                <div className='font-semibold'>{wr}% <span className=''>WR</span></div>
                <div className='text-[10px]/[14px]'>{matches} Matches</div>
            </div>
        </div>
    )
}