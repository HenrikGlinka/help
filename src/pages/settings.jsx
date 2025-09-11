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

                <h2 className="mb-4">Indstillinger</h2>
                <ul className="
                    mt-2 w-full flex flex-col gap-3
                    [&>li]:w-full [&>li]:px-5 [&>li]:py-3 [&>li]:bg-white dark:[&>li]:bg-black [&>li]:rounded-3xl 
                    [&>li>label]:flex [&>li>label]:justify-between [&>li>label]:items-center
                    [&>li>label]:has-[input:disabled]:text-gray-300 [&>li>label]:has-[input:disabled]:line-through
                ">
                    <li>
                        <label>
                            <span>Modtag notifikationer</span>
                            <ToggleButton
                                on={subscribeToNotifications}
                                off={unsubscribeFromNotifications}
                                checked={notificationsOn}
                            />
                        </label>
                    </li>
                    <li>
                        <label><span>Mørkt tema</span>
                            <ToggleButton
                                disable
                                on={() => {
                                    document.body.classList.add('dark');
                                    localStorage.setItem('theme', 'dark');
                                }}

                                off={() => {
                                    document.body.classList.remove('dark');
                                    localStorage.removeItem('theme');
                                }}

                                checked={localStorage.getItem('theme') === 'dark'}
                            />
                        </label>
                    </li>
                    <li>
                        <label>
                            <span>Lyd effekter</span>
                            <ToggleButton
                                on={() => {
                                    localStorage.setItem('sound', 'on');
                                }}

                                off={() => {
                                    localStorage.removeItem('sound');
                                }}

                                checked={localStorage.getItem('sound') !== null}
                            />
                        </label>
                    </li>
                </ul>
                <Link className="button-like mt-auto" to="/"><MdArrowBack className="mr-1" size={20} />Tilbage</Link>
            </main>
        </>
    )

}