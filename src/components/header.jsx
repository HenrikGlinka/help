import { IoIosNotifications } from "react-icons/io";
import { subscribeUserToPush } from "../utilities/push-notifications";

export default function Header({ title }) {


    return (
        <header className="text-center py-3 bg-white grid grid-cols-3">
            <h1 className="text-gray-700 mb-0 col-start-2 row-start-1">{title}</h1>
            <p className="text-sm font-light italic col-start-2 row-start-2">"Spørg om hjælp, hvis du er i tvivl!"</p>
            <button onClick={() => subscribeUserToPush()} className="justify-self-end mr-3 text-2xl aspect-square text-gray-400 hover:text-gray-600 col-start-3 row-span-2"><IoIosNotifications className="w-full h-full" /></button>
        </header>
    )
}