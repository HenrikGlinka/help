import { use, useEffect, useRef, useState } from "react";
import Header from "../components/header";
import QueueCard from "../components/queue-card";
import { getOpenRequests, getOpenRequestsByUser, getUserInfo } from "../helpers/api";
import { useNavigate } from "react-router";
import { Skeleton } from "@mui/material";
import { LuMessageCircleQuestion } from "react-icons/lu";
import messageSound from "../assets/audio/sounds/icq-message.mp3";
import { useLogin } from "../contexts/login-context";
import SpecialOffer from "../components/special-offer";
import { useAlert } from "../contexts/alert-context";
import CoinDisplay from "../components/coin-display";
import CoinOffer from "../components/coin-offer";

export default function IndexPage() {

    const [tickets, setTickets] = useState(null);
    const previousTickets = useRef([]);
    const navigate = useNavigate();

    const user = useLogin();
    const alert = useAlert();

    let updateInterval = null;



    const updateTickets = async () => {

        if (!user.isLoading && !await user.tokenIsValid()) {
            user.logout();
            return;
        }

        const requests = await getOpenRequests(user.data.group);


        if (requests.error) return user.logout();

        if (requests.length > 0) {
            const newTicketIds = requests.map(req => req._id);
            const existingTicketIds = previousTickets.current.map(ticket => ticket._id);
            const isNewTicket = newTicketIds.some(id => !existingTicketIds.includes(id));

            if (isNewTicket && localStorage.getItem('sound') !== null) {
                const audio = new Audio(messageSound);
                audio.play();
            }
        }

        previousTickets.current = requests;
        setTickets(requests);
    }

    useEffect(() => {
        clearInterval(updateInterval);

        if (user.isLoading) return console.log('User data is still loading...');

        const checkAuthAndUpdate = async () => {

            if (localStorage.getItem('token') === null || !await user.tokenIsValid()) {
                user.logout();
            } else {
                updateInterval = setInterval(updateTickets, 10000);
                updateTickets();
            }
        }

        checkAuthAndUpdate();

        return () => clearInterval(updateInterval);

    }, [user.isLoading]);


    async function askNewQuestion() {
        alert.hide();
        const openQuestions = await getOpenRequestsByUser();

        if (openQuestions.length > 0) {
            alert.warning("Vent venligst", "Du har allerede et åbent spørgsmål. Du kan ikke oprette et nyt spørgsmål før det nuværende er besvaret.");
        } else {
            navigate('/ask');
        }
    }

    if (user.isLoading) return null;

    return (
        <>
        <CoinOffer />
            <Header title="Henrik.help"></Header>
            <main className="justify-between">
                <h2>Venteliste for <span className="italic">{user.data?.group.toLowerCase() === 'all' ? 'samtlige hold' : user.data?.group.toUpperCase()}</span></h2>
                <div className="mb-4 overflow-y-auto border-y-1 py-2">
                    {
                        tickets ?
                            (tickets.length > 0 ?
                                tickets.map((ticketData, index) => <QueueCard key={index} ticket={ticketData} onUpdate={updateTickets} />)
                                : <p className="text-center text-gray-500 p-3 italic">Ventelisten er tom.</p>)
                            :
                            <>
                                <Skeleton variant="rectangular" className="mb-1 rounded-2xl" height='5.75rem' />
                                <Skeleton variant="rectangular" className="mb-1 rounded-2xl" height='5.75rem' />
                                <Skeleton variant="rectangular" className="mb-1 rounded-2xl" height='5.75rem' />
                            </>
                    }
                </div>
                <menu className="mt-auto">
                    <li className="flex items-center gap-4">
                        <button onClick={askNewQuestion} className="approve w-full"><LuMessageCircleQuestion className="mr-1" size={20} />
                        Nyt spørgsmål
                        </button>
                        <CoinDisplay />
                        </li>
                </menu>
            </main>
        </>
    )
}