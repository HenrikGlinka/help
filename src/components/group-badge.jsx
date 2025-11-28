export function GroupBadge({ group }) {

    return (
        <span className="text-xs font-bold text-white bg-gray-500 p-[.05rem_.2rem] rounded-sm w-min">{group?.toUpperCase()}</span>
    );
}