import { useLogin } from "../contexts/login-context";
import { getExpToNextLevel, getExpToPreviousLevel, getLevel } from "../helpers/leveling";

export function ExperienceBar() {

    const exp = useLogin().data?.exp || 0;

    const expToPreviousLevel = getExpToPreviousLevel(exp);
    const expToNextLevel = getExpToNextLevel(exp);

    return (
            <progress className="
            appearance-none !border-black dark:!border-white border-1 p-[1px] h-[8px] w-full
            [&::-webkit-progress-bar]:bg-white dark:[&::-webkit-progress-bar]:bg-black/10
            [&::-webkit-progress-value]:bg-black dark:[&::-webkit-progress-value]:bg-white
            [&::-moz-progress-bar]:bg-black dark:[&::-moz-progress-bar]:bg-white
            bg-transparent
        " value={exp - expToPreviousLevel} max={exp - expToPreviousLevel + expToNextLevel} />

    );
}
