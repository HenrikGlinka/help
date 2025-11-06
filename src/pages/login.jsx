import { use, useRef, useState } from 'react';
import Header from '../components/header';
import { PiSpinner } from 'react-icons/pi';
import { Alert, AlertTitle } from '@mui/material';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { postLogin } from '../helpers/api';
import { useLogin } from '../contexts/login-context';
import { useAlert } from '../contexts/alert-context';
import Spinner from '../components/spinner';

export default function LoginPage() {

    const submitButton = useRef(null);
    const [params] = useSearchParams();

    const user = useLogin();
    const alert = useAlert();

    const username = params.get('user') || '';

    const navigate = useNavigate();

    if (user.data && !user.isLoading) navigate('/');

    async function submitHandler(event) {
        event.preventDefault();

        const form = event.target;
        form.inert = true;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const response = await postLogin(data);


        if (response?.token !== undefined) {
            localStorage.setItem('token', response.token);
            await user.update();
            setTimeout(() => navigate('/'), 500);
        } else {
            form.inert = false;
            alert.error("Kunne ikke logge ind", response?.error);
        }

    }

    if (user.isLoading) {
        return (
            <>
                <Header title="Henrik.help"></Header>
                <main>
                    <Spinner />
                </main>
            </>
        )
    }

    return (
        <>
            <Header title="Henrik.help"></Header>
            <main>
                <h2>Log ind</h2>
                <form onSubmit={submitHandler} className='
                    flex flex-col gap-4 border rounded-2xl p-4 bg-white dark:bg-black
                    [&_label]:flex [&_label]:flex-col 
                    [&_span]:text-sm [&_span]:font-bold
                    [&[inert]_button_svg]:block [&[inert]_button_span]:hidden
                '>
                    <label>
                        <span>Navn</span>
                        <input type="text" name="username" placeholder="Skriv dit navn" defaultValue={username} />
                    </label>

                    <label>
                        <span>Adgangskode</span>
                        <input type="password" name="password" placeholder="Skriv din adgangskode" autoComplete='off' />
                    </label>

                    <button ref={submitButton} className="approve" type="submit">
                        <span>Log ind</span>
                        <PiSpinner className='animate-spin hidden m-auto' size={20} />
                    </button>

                </form>
                <section className="flex flex-col gap-4 border rounded-2xl p-4 bg-white dark:bg-black mt-auto">
                    <h2 className='text-sm'>Har du ikke en konto?</h2>
                    <Link to="/register" className="button-like">Opret ny bruger</Link>
                </section>
            </main>

        </>
    )
}