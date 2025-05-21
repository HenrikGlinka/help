
export default function Header({title}) {


    return (
        <header className="text-center py-3 bg-white">
            <h1 className="text-gray-700">{title}</h1>
            <p className="text-sm font-light italic">"Spørg om hjælp, hvis du er i tvivl!"</p>
        </header>
    )
}