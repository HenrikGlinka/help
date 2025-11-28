import { useRef, useState } from 'react';
import Header from '../components/header';
import { PiSpinner } from 'react-icons/pi';
import { Link, useNavigate } from 'react-router';
import { postRequest } from '../helpers/api';
import { useAlert } from '../contexts/alert-context';

export default function LoginPage() {

    const MAX_TITLE_LENGTH = 30;
    const MAX_DESCRIPTION_LENGTH = 200;

    const submitButton = useRef(null);
    const [titleCharacterCount, setTitleCharacterCount] = useState(0);
    const [descriptionCharacterCount, setDescriptionCharacterCount] = useState(0);

    const navigate = useNavigate();

    const alert = useAlert();


    async function submitHandler(event) {
        event.preventDefault();

        alert.hide();

        const form = event.target;
        form.inert = true;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (data.title === '') {
            form.inert = false;
            alert.warning("Fejl i overskrift", "Du skal indtaste en overskrift på dit spørgsmål");
            return;
        }

        if (data.description === '') {
            form.inert = false;
            alert.warning("Fejl i beskrivelse", "Du skal indtaste en beskrivelse af dit spørgsmål");
            return;
        }

        const response = await postRequest(data);

        if (response.acknowledged) {
            setTimeout(() => navigate('/'), 1000);
        } else {
            form.inert = false;
            alert.error("Fejl i oprrettelse af spørgsmål", response.error);
        }

    }

    return (
        <>
            <Header title="Henrik.help"></Header>
            <main>

                <h2>Nyt spørgsmål</h2>
                <form onSubmit={submitHandler} className='
                    flex flex-col gap-4 border rounded-2xl p-4 bg-white dark:bg-black
                    [&_label]:flex [&_label]:flex-col 
                    [&_button]:text-sm [&_button]:font-bold
                    [&[inert]_button_svg]:block [&[inert]_button_span]:hidden
                '>
                    <label>
                        <span>Overskrift</span>
                        <input type="text" onInput={event => setTitleCharacterCount(event.target.value.length)} maxLength={MAX_TITLE_LENGTH} name="title" placeholder="Overskrift på dit spørgsmål" />
                        <span className='text-xs text-gray-500 text-right'>{titleCharacterCount} / {MAX_TITLE_LENGTH} tegn</span>
                    </label>

                    <label>
                        <span>Beskrivelse</span>
                        <textarea onInput={event => setDescriptionCharacterCount(event.target.value.length)} rows={10} maxLength={MAX_DESCRIPTION_LENGTH} name="description" placeholder="Beskriv dit problem"></textarea>
                        <span className='text-xs text-gray-500 text-right'>{descriptionCharacterCount} / {MAX_DESCRIPTION_LENGTH} tegn</span>
                    </label>
                    <button className="approve" ref={submitButton} type="submit"><span>Stil spørgsmål</span><PiSpinner className='animate-spin hidden m-auto' size={20} /></button>
                    <Link to="/" className="button-like cancel">Tilbage</Link>

                </form>
            </main>

        </>
    )
}