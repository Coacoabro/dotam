const Row = ({ cols }) => (
    <div className={`grid grid-cols-${cols.length} p-2 border-b border-neutral-700`}>
        {cols.map((col) => (
            <div>{col}</div>
        ))}
    </div>
)


export default function BlogTable() {
    return(
        <div className="rounded-2xl overflow-hidden border border-neutral-700">
            <div
        </div>
    )
}