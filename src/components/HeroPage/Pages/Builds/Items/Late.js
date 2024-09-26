
import NthItem from './NthItem'

export default function Late({items, isCarry}) {

    if(isCarry){
        return(
            <div className='bg-slate-900 rounded-lg border border-slate-800 space-y-1'>
                <div className='sm:flex items-end gap-2.5 px-5 pt-3'>
                    <h1 className='text-lg sm:text-xl font-bold'>Late Game Items</h1>
                    <h2 className='opacity-50'>Get these after your selected core items</h2>
                </div>
                <div className='grid grid-cols-2 lg:flex place-items-center lg:justify-between w-full gap-2 space-y-2 lg:space-y-0 p-3'>
                    <div className='sm:w-4/5 lg:w-48'><NthItem order="4" items={items.item04} /></div>
                    <div className='sm:w-4/5 lg:w-48'><NthItem order="5" items={items.item05} /></div>
                    <div className='sm:w-4/5 lg:w-48'><NthItem order="6" items={items.item06} /></div>
                    <div className='sm:w-4/5 lg:w-48'><NthItem order="7" items={items.item07} /></div>
                    <div className='sm:w-4/5 lg:w-48'><NthItem order="8" items={items.item08} /></div>
                    <div className='sm:w-4/5 lg:w-48'><NthItem order="9" items={items.item09} /></div>
                </div>
            </div>
            
        )
    }
    else{
        return(
            <div className='bg-slate-900 rounded-lg border border-slate-800 space-y-1'>
                <div className='sm:flex items-end gap-2.5 px-5 pt-3'>
                    <h1 className='text-lg sm:text-xl font-bold'>Late Game Items</h1>
                    <h2 className='opacity-50'>Get these after your selected core items</h2>
                </div>
                <div className='grid grid-cols-2 lg:flex sm:place-items-center lg:justify-between w-full gap-2 space-y-2 lg:space-y-0'>
                    <div className='sm:w-4/5 lg:w-48'><NthItem order="3" items={items.item03} /></div>
                    <div className='sm:w-4/5 lg:w-48'><NthItem order="4" items={items.item04} /></div>
                    <div className='sm:w-4/5 lg:w-48'><NthItem order="5" items={items.item05} /></div>
                    <div className='sm:w-4/5 lg:w-48'><NthItem order="6" items={items.item06} /></div>
                    <div className='sm:w-4/5 lg:w-48'><NthItem order="7" items={items.item07} /></div>
                    <div className='sm:w-4/5 lg:w-48'><NthItem order="8" items={items.item08} /></div>
                </div>
            </div>  
            
        )
    }
    
}