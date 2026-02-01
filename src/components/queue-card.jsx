import { GoDiscussionClosed } from "react-icons/go";
import { formatDate } from "../utilities/format-date";
import { completeRequest, startRequest } from "../helpers/api";
import { useRef } from "react";
import CompleteSound from "../assets/audio/sounds/fanfare.mp3";
import { PiHandshakeLight, PiSpinner } from "react-icons/pi";
import { useLogin } from "../contexts/login-context";
import UserTag from "./user-tag";
import { getLevel } from "../helpers/leveling";
import capitalizeFirstLetters from "../utilities/capitalize-first-letters";
import { FaHandsHelping } from "react-icons/fa";

export default function QueueCard({ ticket, onUpdate = null }) {

    const user = useLogin();

    const status = ticket.completion_date ? 'Besvaret' : (ticket.response_date ? 'Aktiv' : 'Afventer');
    const statusColor = ticket.completion_date ? 'bg-gray-500' : (ticket.response_date ? 'bg-green-600' : 'bg-blue-400');

    const startButton = useRef(null);
    const completeButton = useRef(null);

    async function startRequestHandler(ticketId) {
        startButton.current.disabled = true;

        const response = await startRequest(ticketId);

        if (!response.error) {
            if (onUpdate !== null) onUpdate();
            console.log(response);
        }
        else {
            console.error(response.error);
        }

        startButton.current.disabled = false;
    }

    async function completeRequestHandler(id) {
        completeButton.current.disabled = true;

        const response = await completeRequest(id);

        if (response === null) {
            console.error("Failed to complete request");
            completeButton.current.disabled = false;
        } else {
            user.update();
            if (localStorage.getItem('sound') !== null) {
                const completeSound = new Audio(CompleteSound);
                completeSound.play();
            }

            if (onUpdate !== null) onUpdate();
        }

        completeButton.current.disabled = false;
    }

    return (
        <div className="bg-white border p-4 grid-cols-[1fr_auto_auto] grid mb-1 dark:bg-black">
            {ticket.response_date &&
                <div className="absolute -m-6 bg-orange-600 text-white py-0.5 px-3 text-xs flex items-center animate-bounce rounded-2xl">
                    <FaHandsHelping size={26} />
                    <span className="mr-1"><UserTag username={ticket.responder_name} level={getLevel(ticket.responder_exp)} shorten /></span>
                </div>
            }
            <details className="col-span-3 mb-2 group" name="ticket-details">
                <summary className="flex justify-between gap-1 items-center">
                    <p className="truncate min-w-0">{ticket.title}</p>
                    <p className="text-2xl font-normal group-open:rotate-90 mr-auto transition-transform min-w-fit">›</p>
                    <p className={`${statusColor} text-white self-start px-3 py-1 shrink-0 text-xs flex items-center font-bold min-w-18 justify-center uppercase [clip-path:polygon(0.25rem_0,100%_0,100%_calc(100%-0.25rem),calc(100%-0.25rem)_100%,0_100%,0_0.25rem)]`}>
                        {status}
                    </p>
                </summary>
                <p className="text-sm text-gray-500 my-1 truncate min-w-0">{ticket.description}</p>
            </details>

            <div className="[&:first-letter]:uppercase min-w-0">
                <UserTag username={ticket.owner} level={getLevel(ticket.owner_exp)} group={ticket.group} shorten /></div>
            <p className="col-span-2 text-sm self-center whitespace-nowrap ml-1">{formatDate(ticket.creation_date, 'kl. HH:mm')}</p>

            {(!ticket.response_date || ticket.isOwner || ticket.isAdmin) &&
                <>
                    <hr className="col-span-3" />
                    <menu className="flex justify-end gap-3 col-span-3 flex-wrap">

                        {!ticket.isOwner && !ticket.response_date &&
                            <li className="grow max-w-56">
                                <button ref={startButton} onClick={async () => await startRequestHandler(ticket._id)} className="text-nowrap w-full relative !px-9">
                                    {!startButton.current?.disabled ?
                                        <><PiHandshakeLight className="absolute left-4" size={20} />Tilbyd Hjælp</> :
                                        <PiSpinner className='animate-spin m-auto' size={20} />
                                    }
                                </button>
                            </li>
                        }
                        {(ticket.isOwner || ticket.isAdmin) &&
                            <li className="grow max-w-56">
                                <button ref={completeButton} onClick={() => completeRequestHandler(ticket._id)} className="approve text-nowrap w-full relative !px-9">
                                    {!completeButton.current?.disabled ?
                                        <><GoDiscussionClosed className="absolute left-4" size={20} />Løst</> :
                                        <PiSpinner className='animate-spin m-auto' size={20} />
                                    }
                                </button>
                            </li>
                        }
                    </menu>
                </>}
        </div>
    )
}