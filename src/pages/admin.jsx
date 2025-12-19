import { use, useEffect, useRef, useState } from "react";
import Header from "../components/header";
import { addInvite, deleteInvite, findUsers, getInvites, getUserInfo, resetUserPassword } from "../helpers/api";
import { Link } from "react-router";
import { BsTrash3 } from "react-icons/bs";
import { useLogin } from "../contexts/login-context";
import { useAlert } from "../contexts/alert-context";
import Spinner from "../components/spinner";
import { RiUserSearchLine } from "react-icons/ri";
import capitalizeFirstLetters from "../utilities/capitalize-first-letters";
import UserTag from "../components/user-tag";
import { HiOutlineClipboardCopy } from "react-icons/hi";
import { LiaSpinnerSolid } from "react-icons/lia";
import { CgSpinnerAlt } from "react-icons/cg";

export default function AdminPage() {

    const user = useLogin();

    if (!user.loading && user?.data?.role !== 'admin') user.logout();

    const alert = useAlert();

    const [invites, setInvites] = useState([]);

    const [foundUsers, setFoundUsers] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const [resetPassword, setResetPassword] = useState(null);

    const userSearchInput = useRef(null);

    useEffect(() => { getInvites().then(data => setInvites(data)); }, []);


    const handleAddInvite = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const role = formData.get('role');
        const group = formData.get('group');
        const code = formData.get('invite');
        addInvite({ role, group, code }).then(response => {
            if (!response.error) {
                getInvites().then(data => setInvites(data));
                alert.success('Invitationen blev oprettet succesfuldt.');
                event.target.reset();
            } else {
                alert.error('Fejl ved oprettelse af invitation', response.error || 'Ukendt fejl.');
            }
        });
    };

    const handleDeleteInvite = async (inviteId) => {
        if (confirm('Er du sikker på, at du vil slette denne invitation?')) {

            if (await deleteInvite(inviteId)) {
                getInvites().then(data => setInvites(data));
                alert.success('Invitationen blev slettet succesfuldt.');
            } else {
                alert.error('Der opstod en fejl under sletningen af invitationen.');
            }
        }
    };

    const handleUserSearch = async (event) => {
        const query = event.target.value;

        if (query.length >= 3) {
            setIsSearching(true);
            findUsers(query).then(data => {
                setFoundUsers(data)
                setIsSearching(false);
            });
        } else {
            setFoundUsers([]);
        }
    };

    const handleResetPassword = async (username, id) => {
        if (confirm(`Er du sikker på, at du vil nulstille ${capitalizeFirstLetters(username.slice(-1) === 's' ? username + "'" : username + "s")} adgangskode?`)) {
            const result = await resetUserPassword(id);
            if (result.error !== undefined) {
                alert.error(result.error);
            } else if (result.password) {
                alert.success('Adgangskoden er nu nulstillet.');
                userSearchInput.current.value = '';
                setResetPassword({ username, password: result.password });
                setFoundUsers([]);
            } else {
                alert.error('Der opstod en ukendt fejl ved nulstilling af adgangskoden.');
            }
        }
    };

    if (user.loading) {
        return (
            <>
                <Header title="Henrik.help"></Header>
                <main>
                    <h2>Administrator panel</h2>
                    <Spinner />
                </main>
            </>
        )
    }

    return (
        <>
            <Header title="Henrik.help"></Header>
            <main className="flex flex-col gap-6">
                <h2>Administrator panel</h2>

                <form onSubmit={handleAddInvite} method="post" className='
                flex flex-col gap-4 border rounded-2xl p-4 bg-white dark:bg-black
                    [&_label]:flex [&_label]:flex-col
                    [&_button]:text-sm [&_button]:font-bold
                    [&[inert]_button_svg]:block [&[inert]_button_span]:hidden'
                >
                    <details name="admin" className="group">
                        <summary>
                            <h3>Opret ny invitation</h3>
                            <p className="text-2xl font-normal group-open:rotate-90 transition-transform ml-auto">›</p>
                        </summary>
                        <label>
                            <span>Rolle:</span>
                            <select name="role" defaultValue="user" onChange={event => {
                                if (event.target.value === 'admin') {
                                    if (!confirm('Er du helt sikker på, at du vil oprette en invitation med administrator-rettigheder?')) {
                                        event.target.value = 'user';
                                    }
                                }
                            }}>
                                <option value="user">Bruger</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </label>
                        <label>
                            <span>Hold:</span>
                            <select name="group">
                                <option value="WU13">WU13</option>
                                <option value="WU14">WU14</option>
                                <option value="WU15">WU15</option>
                                <option value="WU16">WU16</option>
                                <option value="WU17">WU17</option>
                                <option value="WU18">WU18</option>
                                <option value="WU19">WU19</option>
                                <option value="WU20">WU20</option>
                            </select>
                        </label>
                        <label>
                            <span>Invitationsnøgle:</span>
                            <input className="key" type="text" name="invite" placeholder="Indtast invitationsnøgle" />
                        </label>
                        <button type="submit" className="approve w-full mt-4">Opret invitation</button>
                    </details>
                </form>

                <section className="flex flex-col gap-4 border rounded-2xl p-4 bg-white dark:bg-black text-left cursor-pointer">
                    <details name="admin" className="group">
                        <summary>
                            <h3>Eksisterende invitationer</h3>
                            <p className="text-2xl font-normal group-open:rotate-90 transition-transform ml-auto">›</p>
                        </summary>
                        {invites && invites.length > 0 ? (
                            <table className="
                            w-full text-sm
                            [&>tbody>tr>td]:p-2 text-center 
                            [&>tbody>tr]:nth-[odd]:bg-gray-200 dark:[&>tbody>tr]:nth-[odd]:bg-gray-800
                            [&>tbody>tr>td]:first:text-left [&>thead>tr>th]:first:text-left
                            ">
                                <thead>
                                    <tr className="[&>th]:w-1/3">
                                        <th>Invitationsnøgle</th>
                                        <th>Rolle</th>
                                        <th>Hold</th>
                                        <th className="w-[1%]">Slet</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invites.map((invite) => (
                                        <tr key={invite._id}>
                                            <td className="key">{invite.code}</td>
                                            <td>{invite.role === 'admin' ? 'Administrator' : 'Bruger'}</td>
                                            <td>{invite.group}</td>
                                            <td><button className="cancel !px-0 w-7 h-7" onClick={() => handleDeleteInvite(invite._id)}><BsTrash3 size={18} /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center italic">Ingen eksisterende invitationer.</p>
                        )}
                    </details>
                </section>

                <section className='
                flex flex-col gap-4 border rounded-2xl p-4 bg-white dark:bg-black
                    [&_label]:flex [&_label]:flex-col
                    [&_button]:text-sm [&_button]:font-bold
                    [&[inert]_button_svg]:block [&[inert]_button_span]:hidden'
                >
                    <details name="admin" className="group">
                        <summary>
                            <h3>Nulstil adgangskoder</h3>
                            <p className="text-2xl font-normal group-open:rotate-90 transition-transform ml-auto">›</p>
                        </summary>
                        <label className="!grid grid-cols-[auto_1fr] content-center items-center">
                            <span className="col-span-2">Find bruger:</span>
                            {isSearching ? <CgSpinnerAlt className="animate-spin [animation-duration:400ms]" /> : <RiUserSearchLine />}
                            <input ref={userSearchInput} onInput={handleUserSearch} type="search" placeholder="Skriv et brugernavn" />
                            {foundUsers.length > 0 && <table className="
                            w-full text-sm mt-4
                            rounded-lg overflow-hidden
                            [&>tbody>tr>td]:p-2 text-center col-span-2
                            [&>tbody>tr]:nth-[odd]:bg-gray-200 dark:[&>tbody>tr]:nth-[odd]:bg-gray-800
                            [&>tbody>tr>td]:first:text-left [&>thead>tr>th]:first:text-left [&>thead>tr>th]:last:text-right [&>thead>tr>th]:px-2
                            ">
                                <tbody>
                                    {foundUsers.map(user => (
                                        <tr key={user._id}>
                                            <td className="whitespace-nowrap"><UserTag username={user.username} group={user.group} /></td>
                                            <td><button className="cancel h-7 ml-auto" onClick={() => handleResetPassword(user.username, user._id)}>Nulstil</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            }
                            {!isSearching && foundUsers?.length === 0 && userSearchInput?.current?.value.length >= 3  && <p className="col-span-2 italic mt-4 text-center text-sm">Ingen brugere fundet.</p>}

                            {resetPassword !== null && <div className="mt-4 col-span-2 grid grid-cols-[1fr_auto] gap-y-2">
                                <h4 className="col-span-2">Ny adgangskode for <i>{resetPassword.username}</i>:</h4>
                                <output className="key p-2 block bg-gray-800 text-white rounded-l-xl text-sm w-full">{resetPassword.password}</output>
                                <button className=" w-10 !px-0 !rounded-l-none !rounded-r-xl" onClick={() => {
                                    navigator.clipboard.writeText(resetPassword.password);
                                    alert.info('Adgangskoden er kopieret til udklipsholderen.');
                                }}>
                                    <HiOutlineClipboardCopy size={20} />
                                </button>
                            </div>}

                        </label>
                    </details>
                </section>

                <Link to="/" className="button-like mt-auto">Tilbage</Link>
            </main>
        </>
    )
}