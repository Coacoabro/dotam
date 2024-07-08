import { useState } from 'react'

export default function Info({ data }) {

    const [showInfo, setShowInfo] = useState(false);
    const handleClick = () => {
        router.push('/basics')
    }

    return(
        <div>
            <button 
                className='text-white text-xl space-x-2'
                onMouseEnter={() => setShowInfo(true)}
                onMouseLeave={() => setShowInfo(false)}
                onClick={handleClick}
            >
                ⓘ
            </button>
            {showInfo && (
                <div className="absolute mt-10 bg-gray-800 text-white p-2 rounded-md text-left">
                    Hero {data} Info
                </div>
            )}
        </div>
    )
}