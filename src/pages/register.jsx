import { useRef, useState } from 'react';
import Header from '../components/header';
import { PiSpinner } from 'react-icons/pi';
import { Alert, AlertTitle } from '@mui/material';
import { Link, useNavigate } from 'react-router';

export default function RegisterPage() {

    const submitButton = useRef(null);
    const [alertBox, setAlertBox] = useState(null);

    const navigate = useNavigate();

    async function submitHandler(event) {
        event.preventDefault();

        setAlertBox(null);

        const form = event.target;
        form.inert = true;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (data.username === '') {
            form.inert = false;
            setTimeout(() => setAlertBox(<Alert variant="filled" severity="warning"><AlertTitle>Fejl i brugernavn</AlertTitle>Du skal indtaste et brugernavn</Alert>));
            return;
        }

        if (data.password === '' || data.password !== data.repeat) {
            form.inert = false;
            setTimeout(() => setAlertBox(<Alert variant="filled" severity="warning"><AlertTitle>Fejl i adgangskode</AlertTitle>De indtastede adgangskoder matcher ikke</Alert>));
            return;
        }

        if (data.invite === '') {
            form.inert = false;
            setTimeout(() => setAlertBox(<Alert variant="filled" severity="warning"><AlertTitle>Fejl i invitationsnøgle</AlertTitle>Du skal indtaste en invitationsnøgle</Alert>));
            return;
        }
        
        const response = await postRegister(data);

        console.log(response);
        

        if (response.ok) {
            const result = await response.json();
            form.reset();
            setAlertBox(<Alert variant="filled" severity="success"><AlertTitle>Registrering gennemført</AlertTitle>Din bruger er nu oprettet. Du kan nu logge ind.</Alert>);
            setTimeout(() => navigate(`/login?user=${data.username}`), 2000);
        } else {
            const error = await response.json();
            form.inert = false;
            setAlertBox(<Alert variant="filled" severity="error"><AlertTitle>Registrering fejlede</AlertTitle>{error.error}</Alert>);
            console.log(error);
            
        }

    }

    return (
        <>
            <Header title="Henrik.help"></Header>
            <main className="flex flex-col grow">

                <h2>Registrering</h2>
                <form onSubmit={submitHandler} className='
                    flex flex-col gap-4 border rounded-2xl p-4 bg-white
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
                <p className="text-sm text-gray-500 mt-2 text-center font-bold">Har du allerede en konto?</p>
                <Link to="/login" className="text-green-500 text-center underline">Log ind</Link>

                {alertBox}
            </main>

        </>
    )
}