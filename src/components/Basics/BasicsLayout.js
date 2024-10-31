import Link from "next/link"
import { useEffect, useState } from "react"
import Navigation from "./Navigation"
import OnThisPage from "./OnThisPage"

export default function BasicsLayout({children, headings}){
    return(
        <div className="flex space-x-4 mt-8">
            <div className="w-1/6 rounded-lg h-full"><Navigation /></div>
            <div className="w-2/3 basics p-4">
                {children}
            </div>
            <OnThisPage headings={headings} />
        </div>
    )
}