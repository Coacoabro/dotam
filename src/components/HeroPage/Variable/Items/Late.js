
import NthItem from './NthItem'

export default function Late({items, isCarry}) {

    if(isCarry){
        return(
            <div className='flex justify-between w-full gap-2'>
                <div className='w-1/5'><NthItem order="4" items={items.item04} /></div>
                <div className='w-1/5'><NthItem order="5" items={items.item05} /></div>
                <div className='w-1/5'><NthItem order="6" items={items.item06} /></div>
                <div className='w-1/5'><NthItem order="7" items={items.item07} /></div>
                <div className='w-1/5'><NthItem order="8" items={items.item08} /></div>
            </div>
        )
    }
    else{
        return(
            <div className='flex justify-between w-full gap-2'>
                <div className='w-1/5'><NthItem order="3" items={items.item03} /></div>
                <div className='w-1/5'><NthItem order="4" items={items.item04} /></div>
                <div className='w-1/5'><NthItem order="5" items={items.item05} /></div>
                <div className='w-1/5'><NthItem order="6" items={items.item06} /></div>
                <div className='w-1/5'><NthItem order="7" items={items.item07} /></div>
            </div>
        )
    }
    
}