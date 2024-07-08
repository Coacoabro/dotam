import Item from '../../Item'

export default function CoreItems({core, matches, isCarry}) {

    const items = core.Core
    const pr = ((core.Matches/matches)*100).toFixed(1)
    const wr = ((core.Wins/core.Matches)*100).toFixed(1)

    if(isCarry){
        return(
            <tr>
                <td className='px-2 py-2 border-b border-slate-800'><Item id={items[0]} /></td>
                <td className='px-2 border-b border-slate-800'><Item id={items[1]} /></td>
                <td className='px-2 border-b border-slate-800'><Item id={items[2]} /></td>
                <td className='text-lg border-l border-b border-slate-800'>{wr}%</td>
                <td className='border-b border-slate-800'>
                    <div className='opacity-50'>{core.Matches.toLocaleString()}</div>
                </td>
            </tr>
        )
    }
    else {
        return(
            <tr>
                <td className='px-2 py-2 border-b border-slate-800'><Item id={items[0]} /></td>
                <td className='px-2 border-b border-slate-800'><Item id={items[1]} /></td>
                <td className='text-lg border-l border-b border-slate-800'>{wr}%</td>
                <td className='border-b border-slate-800'>
                    <div className='opacity-50'>{core.Matches.toLocaleString()}</div>
                </td>
            </tr>
        )
    }

    
}