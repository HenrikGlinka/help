import { useRef, useState } from 'react';
import Header from '../components/header';
import { PiSpinner } from 'react-icons/pi';
import { Alert, AlertTitle } from '@mui/material';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { postRequest } from '../helpers/api';

export default function LoginPage() {

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

        const response = await postRequest(data);

        console.log('Response from postRequest:', response);
        

        if (response.acknowledged) {
            setTimeout(() => navigate('/'), 2000);
        } else {
            const error = await response.json();
            form.inert = false;
            setAlertBox(<Alert variant="filled" severity="error"><AlertTitle>Fejl i oprrettelse af spørgsmål</AlertTitle>{error.error}</Alert>);
        }

    }

    return (
        <>
            <Header title="Henrik.help"></Header>
            <main className="flex flex-col grow">

                <h2>Nyt spørgsmål</h2>
                <form onSubmit={submitHandler} className='
                    flex flex-col gap-4 border rounded-2xl p-4 bg-white
                    [&_label]:flex [&_label]:flex-col 
                    [&_button]:text-sm [&_button]:font-bold
                    [&[inert]_button_svg]:block [&[inert]_button_span]:hidden
                '>
                    <label>
                        <span>Overskrift</span>
                        <input type="text" name="title" placeholder="Overskrift på dit spørgsmål" />
                        
                    </label>

                    <label>
                        <span>Beskrivelse</span>
                        <textarea rows={10} name="description" placeholder="Beskriv dit problem"></textarea>
                    </label>
                    <button ref={submitButton} type="submit"><span>Stil spørgsmål</span><PiSpinner className='animate-spin hidden m-auto' size={24} /></button>
                    <button className='cancel' onClick={() => navigate('/')}>Tilbage</button>

                </form>

                {alertBox}
            </main>

        </>
    )
}