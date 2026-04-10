import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Page from './Page'

export default function PagesList({ hero }) {

    const router = useRouter()
    const initPath = router.asPath.split('/').pop()
    const initOptions = initPath.split("?")[1]

    const [currOptions, setCurrOptions] = useState(initOptions != undefined ? '?' + initOptions : '')

    useEffect(() => {
        const initPath = router.asPath.split('/').pop()
        const initOptions = initPath.split("?")[1]
        setCurrOptions(initOptions != undefined ? '?' + initOptions : '')
    }, [router])

    return(
        <div className='flex relative z-[35] px-2 space-x-3 mt-6 -ml-2'>
            <Page hero={hero} page={"builds"} currOptions={currOptions} />
            <Page hero={hero} page={"items"} currOptions={currOptions} />
            <Page hero={hero} page={"abilities"} currOptions={currOptions} />
            {/* <Page page={""} /> */}            
        </div>
    )
}