export default function PictureBox({ children, imgSrc=[] }) {
    return(
        <div className="bg-slate-800 rounded-lg mt-4">
            <div className="flex justify-between">
                {imgSrc.map(src => (
                    <img src={src} className=""/>
                ))}
            </div>

            <div className="px-2 py-4">
                {children}
            </div>
        </div>
    )
}