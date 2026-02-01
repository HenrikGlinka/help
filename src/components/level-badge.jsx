import { useLogin } from "../contexts/login-context";
import { getLevel } from "../helpers/leveling";

export default function LevelBadge({level = 0}) {
    return (
        <span className="text-xs inline-block font-bold rounded-sm px-1 shadow-[inset_0_0_0_1px] w-min whitespace-nowrap select-none">
            Lv. {level}
        </span>
    )
}