import { useLogin } from "../contexts/login-context";
import { getLevel } from "../helpers/leveling";

export default function LevelBadge({level = 0}) {
    return (
        <span className="text-xs font-bold text-white bg-black p-[.05rem_.2rem] rounded-sm px-0.5 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)] w-min whitespace-nowrap">
            Lv. {level}
        </span>
    )
}