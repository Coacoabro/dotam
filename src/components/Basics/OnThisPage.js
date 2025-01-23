import { useEffect, useState } from "react"

export default function OnThisPage({headings}) {

    return(
        <div>
            <span className="text-xl">ON THIS PAGE</span>
            {headings.length > 0 ? (
                <>
                    {headings.map(({depth, text, id}) => (
                        <div className={`py-1 px-2 flex items-center`}>
                            {depth == 3 ? (
                                <div>--</div>
                            ) : null}
                            <a href={`#${id}`} className="hover:underline">
                                {text}
                            </a>
                        </div>
                    ))}
                </>
            ) : null}
        </div>
    )
}