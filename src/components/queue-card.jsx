import { GoDiscussionClosed } from "react-icons/go";
import { formatDate } from "../utilities/format-date";
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { completeRequest, startRequest } from "../helpers/api";

export default function QueueCard({ ticket, onUpdate = null }) {

    const status = ticket.completion_date ? 'Besvaret' : (ticket.response_date ? 'Aktiv' : 'Afventer');
    const statusColor = ticket.completion_date ? 'bg-gray-500' : (ticket.response_date ? 'bg-green-600' : 'bg-blue-400');


    async function startRequestHandler(id) {
        const response = await startRequest(id);
        if (response) if (onUpdate !== null) onUpdate();
        else console.error("Failed to start request");
    }

    async function completeRequestHandler(id) {
        const response = await completeRequest(id);
        if (response) if (onUpdate !== null) onUpdate();
        else console.error("Failed to complete request");
    }


    return (
        <div className="bg-white border rounded-2xl p-4 grid-cols-[1fr_auto_auto] grid mb-1">
            <details className="col-span-3 mb-2" name="ticket-details">
                <summary className="flex justify-between gap-1 items-center">
                    <p className="w-full">{ticket.title}</p>
                    <p className={`${statusColor} text-white self-start px-3 py-1 shrink-0 text-xs flex items-center font-bold rounded-lg min-w-18 justify-center uppercase`}>
                        {status}
                    </p>
                </summary>
                <p className="text-sm text-gray-600 my-1">{ticket.description}</p>
            </details>

            <p className="[&:first-letter]:uppercase">{ticket.owner}</p>
            <p className="col-span-2 text-sm self-center">{formatDate(ticket.creation_date, 'kl. HH:mm')}</p>
            {(ticket.isOwner || ticket.isAdmin) &&
                <>
                    <hr className="col-span-3" />
                    <menu className="flex justify-end gap-3 col-span-3">
                        <>
                            {!ticket.response_date && ticket.isAdmin && ticket.completion_date === undefined &&
                                <li><button onClick={() => startRequestHandler(ticket._id)} className="w-min p-2 text-nowrap"><HiOutlineChatBubbleOvalLeftEllipsis className="mr-1" size={20} />Besvar</button></li>
                            }
                            <li><button onClick={() => completeRequestHandler(ticket._id)} className="approve w-min p-2 text-nowrap"><GoDiscussionClosed className="mr-1" size={20} />Løst</button></li>
                        </>
                    </menu>
                </>
            }
        </div>
    )
}