import { useEffect, useRef, useState } from "react";
import Header from "../components/header";
import QueueCard from "../components/queue-card";
import { getOpenRequests, getOpenRequestsByUser } from "../helpers/api";
import { useNavigate } from "react-router";
import { Alert, AlertTitle, Skeleton } from "@mui/material";
import { SlLogout } from "react-icons/sl";
import { LuMessageCircleQuestion } from "react-icons/lu";
import messageSound from "../assets/audio/sounds/icq-message.mp3";

export default function IndexPage() {

    const [tickets, setTickets] = useState(null);
    const previousTickets = useRef([]);
    const navigate = useNavigate();
    const [alertBox, setAlertBox] = useState(null);

    const updateTickets = async () => {
        const requests = await getOpenRequests();

        if (requests.error === 'Invalid token') navigate('/login');

        console.log("Fetched requests");
        console.log(requests);
        
        if (requests.length > 0) {
            const newTicketIds = requests.map(req => req._id);
            const existingTicketIds = previousTickets.current.map(ticket => ticket._id);
            const isNewTicket = newTicketIds.some(id => !existingTicketIds.includes(id));

            console.log(isNewTicket);
            
            if (isNewTicket) {
                const audio = new Audio(messageSound);
                audio.play();
            }
        }

        previousTickets.current = requests;
        setTickets(requests);
    }

    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            navigate('/login');
            return;
        }

        let updateInterval = setInterval(updateTickets, 10000);

        updateTickets();

        return () => clearInterval(updateInterval);

    }, []);


    async function askNewQuestion() {
        setAlertBox(null);
        const openQuestions = await getOpenRequestsByUser();

        if (openQuestions.length > 0) {
            setTimeout(() => setAlertBox(
                <Alert variant="filled" severity="warning">
                    <AlertTitle>Vent venligst</AlertTitle>
                    Du har allerede et åbent spørgsmål. Du kan ikke oprette et nyt spørgsmål før det nuværende er besvaret.
                </Alert>
            ));
        } else {
            navigate('/ask');
        }
    }

    function logout() {
        localStorage.removeItem('token');
        navigate('/login');
    }


    return (
        <>
            <Header title="Henrik.help"></Header>
            <main className="flex flex-col justify-between grow overflow-hidden">
                <h2>Venteliste</h2>
                <div className="mb-4 overflow-y-auto border-y-1">
                    {
                        tickets ?
                            (tickets.length > 0 ?
                                tickets.map((ticketData, index) => <QueueCard key={index} ticket={ticketData} onUpdate={updateTickets} />)
                                : <p className="text-center text-gray-500 p-3 italic">Ingen åbne spørgsmål</p>)
                            :
                            <>
                                <Skeleton variant="rectangular" className="mb-1 rounded-2xl" height='5.75rem' />
                                <Skeleton variant="rectangular" className="mb-1 rounded-2xl" height='5.75rem' />
                                <Skeleton variant="rectangular" className="mb-1 rounded-2xl" height='5.75rem' />
                            </>
                    }
                </div>
                <menu className="grid grid-cols-[1fr_2fr] gap-2 mt-auto ">
                    <li><button onClick={logout} className="cancel w-full"><SlLogout className="mr-1" size={20} />Log ud</button></li>
                    <li><button onClick={() => askNewQuestion()} className="approve w-full"><LuMessageCircleQuestion className="mr-1" size={20} />Nyt spørgsmål</button></li>
                </menu>

                {alertBox}
            </main>
        </>
    )
}