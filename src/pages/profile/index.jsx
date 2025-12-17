import { useEffect, useState } from "react";
import { useLogin } from "../../contexts/login-context";
import Header from "../../components/header";
import { getUserProfile } from "../../helpers/api";
import { formatDate } from "../../utilities/format-date";
import { getLevel } from "../../helpers/leveling";
import { Link } from "react-router";
import { MdArrowBack } from "react-icons/md";
import capitalizeFirstLetters from "../../utilities/capitalize-first-letters";


export default function ProfilePage({id = null}) {

    const user = useLogin();
    const userId = id ?? user?.data?.id ?? null;
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        if (userId !== null) {
            console.log(userId);
            
            const fetchProfile = async () => {
                const data = await getUserProfile(userId);
                setProfileData(data.user);
            };

            fetchProfile();
        }
    }, [user, userId]);

    return (
        <>
            <Header title="Henrik.help" />
            <main>
                <h2 className="text-2xl font-bold mb-4"> {
                    profileData ? capitalizeFirstLetters(profileData?.username) + (profileData?.username.slice(-1) === 's' ? "'" : "s ") + "profil" : <>&nbsp;</>
                } </h2>

                <table className="border-1 text-sm [&_th,_td]:first:pl-5 [&_th,_td]:last:pr-5 [&_th,_td]:py-2.5 w-full [&_tr]:border-b bg-white dark:bg-gray-700 rounded-xl overflow-hidden">
                    <tbody className="[&_td]:last:text-right [&_td]:last:!font-mono [&_td]:last:w-0 [&_td]:last:whitespace-nowrap">
                        {profileData ?
                            <>
                                <tr>
                                    <td>Profil oprettet:</td>
                                    <td>{formatDate(profileData?.created_at, 'DD/MM YYYY')}</td>
                                </tr>
                                <tr>
                                    <td>Rolle:</td>
                                    <td>{profileData?.role === 'user' ? 'Elev' : 'Lærer'}</td>
                                </tr>
                                <tr>
                                    <td>Hold:</td>
                                    <td>{profileData?.group}</td>
                                </tr>
                                <tr>
                                    <td>Stilte spørgsmål:</td>
                                    <td>{profileData?.questions_asked}</td>
                                </tr>
                                <tr>
                                    <td>Hjulpet andre:</td>
                                    <td>{profileData?.answers_given}</td>
                                </tr>
                                <tr>
                                    <td>Optjente point:</td>
                                    <td>{profileData?.exp}</td>
                                </tr>
                                <tr>
                                    <td>Opnået level:</td>
                                    <td>{getLevel(profileData?.exp)}</td>
                                </tr>
                            </>
                            : Array.from({ length: 7 }).map((_, index) => (
                                <tr key={index} className="animate-[var(--animate-loading)]"><td colSpan={2}>&nbsp;</td></tr>
                            ))}
                    </tbody>
                </table>

                <Link className="button-like mt-auto relative" to={-1}><MdArrowBack className="mr-5 absolute left-4" size={20} />Tilbage</Link>
            </main>
        </>

    );
}