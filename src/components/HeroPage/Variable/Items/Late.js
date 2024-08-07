
import NthItem from './NthItem'

export default function Late({items, isCarry}) {

    if(isCarry){
        return(
            <div className='grid grid-cols-2 lg:flex sm:place-items-center lg:justify-between w-full gap-2 space-y-2 lg:space-y-0'>
                <div className='sm:w-4/5 lg:w-1/5'><NthItem order="4" items={items.item04} /></div>
                <div className='sm:w-4/5 lg:w-1/5'><NthItem order="5" items={items.item05} /></div>
                <div className='sm:w-4/5 lg:w-1/5'><NthItem order="6" items={items.item06} /></div>
                <div className='sm:w-4/5 lg:w-1/5'><NthItem order="7" items={items.item07} /></div>
                <div className='sm:w-4/5 lg:w-1/5'><NthItem order="8" items={items.item08} /></div>
            </div>
        )
    }
    else{
        return(
            <div className='grid grid-cols-2 lg:flex sm:place-items-center lg:justify-between w-full gap-2 space-y-2 lg:space-y-0'>
                <div className='sm:w-4/5 lg:w-1/5'><NthItem order="3" items={items.item03} /></div>
                <div className='sm:w-4/5 lg:w-1/5'><NthItem order="4" items={items.item04} /></div>
                <div className='sm:w-4/5 lg:w-1/5'><NthItem order="5" items={items.item05} /></div>
                <div className='sm:w-4/5 lg:w-1/5'><NthItem order="6" items={items.item06} /></div>
                <div className='sm:w-4/5 lg:w-1/5'><NthItem order="7" items={items.item07} /></div>
            </div>
        )
    }
    
}