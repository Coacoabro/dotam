export default function PictureBox({ children, imgSrc=[], isFlex }) {


    return(
        <div className="bg-slate-800 rounded-lg mt-4">
            <div className={`${isFlex ? "flex" : ""} justify-between p-4 space-y-4`}>
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