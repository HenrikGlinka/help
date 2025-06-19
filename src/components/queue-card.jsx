import { formatDate } from "../utilities/format-date";

export default function QueueCard({ ticket }) {

    const status = ticket.completion_date ? 'Afsluttet' : (ticket.response_date ? 'Aktiv' : 'Afventer');


    return (
        <div className="bg-white border rounded-2xl p-4 grid-cols-[1fr_auto_auto] grid mb-1">
            <details className="col-span-2" name="ticket-details">
                <summary>{ticket.title}</summary>
                <p className="text-sm text-gray-600 my-1">{ticket.description}</p>
                <menu>
                    <li><button></button></li>
                </menu>
            </details>
            <p className={`
                ${status === 'Afsluttet' ? 'bg-gray-500' : (status === 'Aktiv' ? 'bg-green-600' : 'bg-red-400')}
                 text-white px-2 py-1 text-xs flex items-center font-bold rounded-full min-w-18 justify-center uppercase
                `}>{status}</p>
            <p>{ticket.owner}</p>
            <p className="col-span-2">{formatDate(ticket.creation_date, 'kl. HH:mm')}</p>
        </div>
    )
}