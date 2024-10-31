import { useEffect, useState } from "react"

export default function OnThisPage({headings}) {


    console.log(headings)

    return(
        <div>
            <span className="text-xl">ON THIS PAGE</span>
            {headings.length > 0 ? (
                <>
                    {headings.map(({depth, text, id}) => (
                        <div className={`ml-${(depth - 1)*4} text-sm py-1 px-2`}>
                            <a href={`#${id}`}>
                                {text}
                            </a>
                        </div>
                    ))}
                </>
            ) : null}
        </div>
    )
}