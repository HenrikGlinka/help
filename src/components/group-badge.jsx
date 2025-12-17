export function GroupBadge({ group }) {

    return (
        <span className="text-xs text-center !font-mono font-bold text-white bg-gray-500 p-[.05rem_.2rem] rounded-sm w-min min-w-[5ch] select-none">{group?.toUpperCase()}</span>
    );
}