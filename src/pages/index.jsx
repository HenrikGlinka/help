import Header from "../componenets/header";

export default function IndexPage() {

    return (
        <>
            <Header title="Henrik.help"></Header>
            <main className="flex flex-col justify-between grow">
                <h2>Venteliste</h2>

                <button>Nyt spørgsmål</button>
            </main>
        </>
    )
}