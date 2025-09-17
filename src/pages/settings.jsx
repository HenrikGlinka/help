import { use, useEffect, useState } from "react";
import Header from "../components/header";
import ToggleButton from "../components/toggle-button";
import { MdArrowBack } from "react-icons/md";
import { Link } from "react-router";
import { isSubscribedToNotifications, subscribeToNotifications, unsubscribeFromNotifications } from "../utilities/push-notifications";
import { getAllGroups, getUserInfo } from "../helpers/api";

const notificationsPromise = isSubscribedToNotifications();
const groupsPromise = getAllGroups();
const userInfoPromise = getUserInfo();

export default function Settings() {

    const notificationsOn = use(notificationsPromise);
    const groups = use(groupsPromise);

    const selectedGroup = localStorage.getItem('group') || 'Alle';

    const { user } = use(userInfoPromise);


    return (
        <>
            <Header title="Henrik.help"></Header>
            <main>

                <h2 className="mb-4">Indstillinger</h2>
                <ul className="
                    mt-2 w-full flex flex-col gap-3
                    [&>li]:w-full [&>li]:px-5 [&>li]:py-3 [&>li]:bg-white dark:[&>li]:bg-black [&>li]:rounded-3xl 
                    [&>li>label]:flex [&>li>label]:justify-between [&>li>label]:items-center
                    [&>li>label]:has-[input:disabled,select:disabled]:text-gray-500
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
                                    document.querySelector('meta[name="theme-color"]').setAttribute("content", "#000000");
                                }}

                                off={() => {
                                    document.body.classList.remove('dark');
                                    localStorage.removeItem('theme');
                                    document.querySelector('meta[name="theme-color"]').setAttribute("content", "#ffffff");
                                }}

                                checked={localStorage.getItem('theme') === 'dark'}
                            />
                        </label>
                    </li>
                    <li>
                        <label>
                            <span>Lydeffekter</span>
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
                    <li>
                        <label>
                            <span>Vis hold
                            </span>
                            <select
                                name="class"
                                className="max-w-fit min-w-14 text-right"
                                defaultValue={selectedGroup}
                                onChange={event => localStorage.setItem('group', event.target.value)}
                                disabled={user.role !== 'admin'}
                           >
                                {user.role === 'admin' ?

                                    <>
                                        <option value="all">Alle</option>
                                        {groups.map(group => 
                                            <option key={group} value={group.toLowerCase()}>{group}</option>
                                        )}
                                    </>
                                    :
                                    <option>{user.group}</option>
                                }
                            </select>
                        </label>
                    </li>
                </ul>
                <Link className="button-like mt-auto" to="/"><MdArrowBack className="mr-1" size={20} />Tilbage</Link>
            </main>
        </>
    )

}