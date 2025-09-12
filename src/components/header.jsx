export default function Header({ title }) {


    return (
        <header className="text-center py-3 bg-white dark:bg-black grid grid-cols-[auto_1fr_auto]">
            <h1 className="text-gray-700 dark:text-gray-200 mb-0 col-start-2 row-start-1">{title}</h1>
            <p className="text-sm font-light italic col-start-2 row-start-2">"Spørg om hjælp, hvis du er i tvivl!"</p>
        </header>
    )
}