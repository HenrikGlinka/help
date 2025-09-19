import { use } from "react";
import Header from "../components/header";
import { getUserInfo } from "../helpers/api";
import { Link } from "react-router";

const userInfoPromise = getUserInfo();

export default function AdminPage() {

    const { user } = use(userInfoPromise);

    if (user === undefined || user.role !== 'admin') {
        localStorage.removeItem('token');
        window.location = '/login';
    }


    return (
        <>
            <Header title="Henrik.help"></Header>
            <main>
                <h2>Administrator panel</h2>

                <section className="flex flex-col gap-4 border rounded-2xl p-4 bg-white dark:bg-black text-left">
                    <h3>Eksisterende invitationer</h3>
                   
                </section>

                <form action="/api/admin/invite" method="post" className='
                flex flex-col gap-4 border rounded-2xl p-4 bg-white dark:bg-black
                    [&_label]:flex [&_label]:flex-col
                    [&_button]:text-sm [&_button]:font-bold
                    [&[inert]_button_svg]:block [&[inert]_button_span]:hidden'
                >
                    <h3>Opret ny invitation</h3>
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
                            <option value="WU12">WU12</option>
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
                    <button type="submit" className="approve">Opret invitation</button>
                </form>

                <Link to="/settings" className="button-like mt-auto">Tilbage</Link>
            </main>
        </>
    )
}