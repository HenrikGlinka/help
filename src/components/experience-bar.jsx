import { useLogin } from "../contexts/login-context";
import { getExpToNextLevel, getExpToPreviousLevel, getLevel } from "../helpers/leveling";

export function ExperienceBar({ className = "" }) {

    const user = useLogin();

    return (
        <>
            <progress className={`
            appearance-none !border-black dark:!border-white border-1 p-[1px] h-[8px] w-full block
            [&::-webkit-progress-bar]:bg-white dark:[&::-webkit-progress-bar]:bg-black/10
            [&::-webkit-progress-value]:bg-black dark:[&::-webkit-progress-value]:bg-white
            [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500 [&::-webkit-progress-value]:ease-out
            [&::-moz-progress-bar]:bg-black dark:[&::-moz-progress-bar]:bg-white
            [&::-moz-progress-bar]:transition-all [&::-moz-progress-bar]:duration-500 [&::-moz-progress-bar]:ease-out
            bg-transparent ${className}
            `}
                value={user.exp - user.expToPrevious} max={user.exp - user.expToPrevious + user.expToNext} />
                <p className={`m-0 text-[.5rem] text-black dark:text-white ${className}`}>{user.exp - user.expToPrevious} / {user.expToNext}</p>
        </>

    );
}
