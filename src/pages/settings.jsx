import { use, useEffect, useRef, useState } from "react";
import Header from "../components/header";
import ToggleButton from "../components/toggle-button";
import { MdArrowBack } from "react-icons/md";
import { Link } from "react-router";
import { subscribeToNotifications, unsubscribeFromNotifications } from "../utilities/push-notifications";
import { changeUserGroup, getAllGroups } from "../helpers/api";
import { useLogin } from "../contexts/login-context";

const groupsPromise = getAllGroups();

export default function Settings() {

    const groups = use(groupsPromise);
    const groupRef = useRef();

    const user = useLogin();

    if (!user.isLoading && !user.data) user.logout();

    const [selectedGroup, setSelectedGroup] = useState(user.data?.group?.toLowerCase() || 'all');

    useEffect(() => {
        setSelectedGroup(user.data?.group?.toLowerCase());

    }, [user.data?.group]);

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
                                checked={user.recievesNotifications}
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
                            <span>Hold
                            </span>
                            <select
                                name="class"
                                ref={groupRef}
                                className="max-w-fit min-w-14 text-right"
                                defaultValue={user.data?.group?.toLowerCase() || 'all'}
                                onChange={
                                    async event => {
                                        await changeUserGroup(user.data.id, event.target.value);
                                        user.data.group = event.target.value;
                                    }
                                }
                                disabled={user.data?.role !== 'admin'}
                            >
                                {user.data?.role === 'admin' ?

                                    <>
                                        <option value="all">Alle</option>
                                        {groups?.map(group =>
                                            group.toLowerCase() !== 'all' && <option key={group} value={group.toLowerCase()}>{group}</option>
                                        )}
                                    </>
                                    :
                                    <option value={selectedGroup}>{selectedGroup?.toUpperCase()}</option>
                                }
                            </select>
                        </label>
                    </li>
                    <li>
                        <label>
                            <button onClick={() => localStorage.removeItem('coin-offer')} className="w-fit text">
                                Nulstil tilbud
                            </button>
                        </label>
                    </li>
                </ul>
                <Link className="button-like mt-auto" to="/"><MdArrowBack className="mr-1" size={20} />Tilbage</Link>
            </main>
        </>
    )

}