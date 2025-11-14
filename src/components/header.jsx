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

export default function Header({ title }) {

    const user = useLogin();
    const username = capitalizeFirstLetters(user.data?.username);

    return (
        <header className="text-center px-2 py-3 bg-white dark:bg-black grid grid-cols-[1fr_auto_1fr] items-center gap-1 border-b-1">
            {user.data?.username && <BurgerMenu>
                <Link className="button-like w-full relative" to="/"><BsHouse className="mr-5 absolute left-4" size={20} />Hjem</Link>
                <Link className="button-like w-full relative" to="/settings"><IoSettingsOutline className="mr-5 absolute left-4" size={20} />Indstillinger</Link>
                {user.data?.role === 'admin' && <Link className="button-like w-full relative" to="/admin"><MdOutlineAdminPanelSettings className="mr-5 absolute left-4" size={20} />Admin</Link>}
                <button onClick={user.logout} className="cancel w-full relative"><SlLogout className="mr-5 absolute left-4" size={20} />Log ud</button>
            </BurgerMenu>}
            <h1 className="text-gray-700 dark:text-gray-200 mb-0 col-start-2">{title}</h1>
            {user.data?.username &&
                <div className="text-xs text-right text-gray-500 w-fit justify-self-end">
                    <p>Logget ind som:</p>
                    <p className="font-bold text-sm">{username}
                        <span className="bg-black text-white dark:bg-white dark:text-black mx-1 px-1 py-[.2] rounded-sm text-xs font-bold">Lv. {getLevel(user.data?.exp) || 1}</span>
                    </p>
                    <ExperienceBar />
                </div>
            }
        </header>
    )
}