import { IoSettingsOutline } from "react-icons/io5";
import { useLogin } from "../contexts/login-context";
import capitalizeFirstLetters from "../utilities/capitalize-first-letters";
import { Link } from "react-router";
import BurgerMenu from "./burger-menu";
import { SlLogout } from "react-icons/sl";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { BsHouse } from "react-icons/bs";
import { ExperienceBar } from "./experience-bar";
import { getLevel } from "../helpers/leveling";
import LevelBadge from "./level-badge";
import { GroupBadge } from "./group-badge";
import UserTag from "./user-tag";
import { GoTrophy } from "react-icons/go";

export default function Header({ title }) {

    const user = useLogin();

    return (
        <header className="text-center px-2 py-3 bg-white dark:bg-black grid grid-cols-[1fr_auto_1fr] items-center gap-1 border-b-1">
            {user.data?.username && <BurgerMenu>
                <Link className="button-like w-full relative" to="/"><BsHouse className="mr-5 absolute left-4" size={20} />Hjem</Link>
                <Link className="button-like w-full relative" to="/leaderboard"><span className="mr-5 absolute left-4"><GoTrophy size={20} /></span>Top 10</Link>
                <Link className="button-like w-full relative" to="/settings"><IoSettingsOutline className="mr-5 absolute left-4" size={20} />Indstillinger</Link>
                {user.data?.role === 'admin' && <Link className="button-like w-full relative" to="/admin"><MdOutlineAdminPanelSettings className="mr-5 absolute left-4" size={20} />Admin</Link>}
                <button onClick={user.logout} className="cancel w-full relative"><SlLogout className="mr-5 absolute left-4" size={20} />Log ud</button>
            </BurgerMenu>}
            <h1 className="text-gray-700 dark:text-gray-200 mb-0 col-start-2">{title}</h1>
            {user.data?.username &&
                <div className="text-xs text-right text-gray-500 w-fit justify-self-end grid grid-cols-[auto_1fr_auto] gap-0.5 items-center">
                    <UserTag username={user.data.username} level={user.level} />
                    <ExperienceBar className="col-span-3" />
                </div>
            }
        </header>
    )
}