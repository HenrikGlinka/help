import { use, useEffect, useState } from "react";
import Header from "../components/header";
import ToggleButton from "../components/toggle-button";
import { MdArrowBack } from "react-icons/md";
import { Link } from "react-router";
import { isSubscribedToNotifications, subscribeToNotifications, unsubscribeFromNotifications } from "../utilities/push-notifications";

const notificationsPromise = isSubscribedToNotifications();

export default function Settings() {

    const [uuid, setUuid] = useState(localStorage.getItem("uuid") ?? null);
    const notificationsOn = use(notificationsPromise);

    return (
        <>
            <Header title="Henrik.help"></Header>
            <main>

                <h2 className="mb-4">Settings</h2>
                <ul className="
                    mt-2 w-full flex flex-col gap-3
                    [&>li]:w-full [&>li]:px-5 [&>li]:py-3 [&>li]:bg-white [&>li]:rounded-3xl 
                    [&>li>label]:flex [&>li>label]:justify-between [&>li>label]:items-center
                    [&>li>label]:has-[input:disabled]:text-gray-300 [&>li>label]:has-[input:disabled]:line-through
                ">
                    <li>
                        <label>
                            <span>Tilmeld notifikationer</span>
                            <ToggleButton
                                on={subscribeToNotifications}
                                off={unsubscribeFromNotifications}
                                checked={notificationsOn}
                            />
                        </label>
                    </li>
                    <li><label><span>Dark Mode</span><ToggleButton disabled={true} /></label></li>
                </ul>
                <Link className="button-like mt-10" to="/"><MdArrowBack className="mr-1" size={20} />Tilbage</Link>
            </main>
        </>
    )

}