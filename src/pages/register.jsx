import { useRef, useState } from 'react';
import Header from '../components/header';
import { PiSpinner } from 'react-icons/pi';
import { Alert, AlertTitle } from '@mui/material';
import { Link, useNavigate } from 'react-router';
import { postRegister } from '../helpers/api';
import { useAlert } from '../contexts/alert-context';

export default function RegisterPage() {

    const submitButton = useRef(null);
    const alert = useAlert();

    const navigate = useNavigate();

    async function submitHandler(event) {
        event.preventDefault();

        alert.hide();

        const form = event.target;
        form.inert = true;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (data.username === '') {
            form.inert = false;
            alert.warning("Fejl i brugernavn", "Du skal indtaste et brugernavn");
            return;
        }

        if (data.password === '' || data.password !== data.repeat) {
            form.inert = false;
            alert.warning("Fejl i adgangskode", "De indtastede adgangskoder matcher ikke");
            return;
        }

        if (data.invite === '') {
            form.inert = false;
            alert.warning("Fejl i invitationsnøgle", "Du skal indtaste en invitationsnøgle");
            return;
        }
        
        const response = await postRegister(data);

        console.log(response);
        

        if (!response?.error) {
            form.reset();
            alert.success("Registrering gennemført", "Din bruger er nu oprettet. Du kan nu logge ind.");
            setTimeout(() => navigate(`/login?user=${data.username}`), 3000);
        } else {
            form.inert = false;
            alert.error("Registrering fejlede", response.error);
        }

    }

    return (
        <>
            <Header title="Henrik.help"></Header>
            <main>

                <h2>Registrering</h2>
                <form onSubmit={submitHandler} className='
                    flex flex-col gap-4 border rounded-2xl p-4 bg-white dark:bg-black
                    [&_label]:flex [&_label]:flex-col 
                    [&_span]:text-sm [&_span]:font-bold
                    [&[inert]_button_svg]:block [&[inert]_button_span]:hidden
                '>
                    <label>
                        <span>Navn</span>
                        <input type="text" name="username" placeholder="Skriv dit navn" />
                    </label>

                    <label>
                        <span>Adgangskode</span>
                        <input type="password" name="password" placeholder="Skriv din adgangskode" />
                    </label>

                    <label>
                        <span>Gentag adgangskode</span>
                        <input type="password" name="repeat" placeholder="Gentag din adgangskode" />
                    </label>

                    <label>
                        <span>Invitationsnøgle</span>
                        <input className="key" type="text" name="invite" placeholder="Skriv din invitationsnøgle" autoComplete='off' />
                    </label>

                    <button ref={submitButton} className="approve" type="submit"><span>Opret bruger</span><PiSpinner className='animate-spin hidden m-auto' size={20} /></button>
              
                </form>
                <section className="flex flex-col gap-4 border rounded-2xl p-4 bg-white dark:bg-black mt-auto">
                    <h2 className='text-sm'>Har du allerede en konto?</h2>
                    <Link to="/login" className="button-like">Log ind</Link>
                </section>
            </main>

        </>
    )
}