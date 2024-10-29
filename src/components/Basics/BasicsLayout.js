import Link from "next/link"
import { useEffect, useState } from "react"
import Navigation from "./Navigation"

export default function BasicsLayout({children, files}){
    return(
        <div className="flex space-x-4 mt-8">
            <div className="w-1/6"><Navigation files={files} /></div>
            <div className="w-2/3 basics p-4">
                {children}
            </div>
            <div className="w-1/6">ON THIS PAGE</div>
        </div>
    )
}