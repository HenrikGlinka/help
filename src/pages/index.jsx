import { useEffect, useRef, useState } from "react";
import Header from "../components/header";
import QueueCard from "../components/queue-card";
import { getOpenRequests, getOpenRequestsByUser } from "../helpers/api";
import { useNavigate } from "react-router";
import { Alert, AlertTitle, Skeleton } from "@mui/material";

export default function IndexPage() {

    const [tickets, setTickets] = useState(null);
    const firstLoad = useRef(true);
    const navigate = useNavigate();
    const [alertBox, setAlertBox] = useState(null);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }

        const updateTickets = async () => {
            const requests = await getOpenRequests();
            console.log("Fetched requests");

            setTickets(requests);
        }

        let updateInterval = setInterval(updateTickets, 10000);

        updateTickets();

        return () => clearInterval(updateInterval);

    }, []);


    async function askNewQuestion() {
        setAlertBox(null);
        const openQuestions = await getOpenRequestsByUser();

        if (openQuestions.length > 0) {
            setTimeout(() => setAlertBox(<Alert variant="filled" severity="warning"><AlertTitle>Vent venligst</AlertTitle>Du har allerede et åbent spørgsmål. Du kan ikke oprette et nyt spørgsmål før det nuværende er besvaret.</Alert>));
        } else {
            navigate('/ask');
        }
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
                                tickets.map((ticketData, index) => <QueueCard key={index} ticket={ticketData} />)
                                : <p className="text-center text-gray-500 p-3 italic">Ingen åbne spørgsmål</p>)
                            :
                            <>
                                <Skeleton variant="rectangular" className="mb-1 rounded-2xl" height='5.75rem' />
                                <Skeleton variant="rectangular" className="mb-1 rounded-2xl" height='5.75rem' />
                                <Skeleton variant="rectangular" className="mb-1 rounded-2xl" height='5.75rem' />
                            </>
                    }
                </div>

                <button onClick={() => askNewQuestion()} className="mt-auto">Nyt spørgsmål</button>
                {alertBox}
            </main>
        </>
    )
}