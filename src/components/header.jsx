export default function Header({ title }) {


    return (
        <header className="text-center py-3 bg-white grid grid-cols-3">
            <h1 className="text-gray-700 mb-0 col-start-2 row-start-1">{title}</h1>
            <p className="text-sm font-light italic col-start-2 row-start-2">"Spørg om hjælp, hvis du er i tvivl!"</p>
        </header>
    )
}