import { useEffect, useState } from "react";
import Header from "../components/header";
import { getLeaderboard } from "../helpers/api";
import { getLevel } from "../helpers/leveling";
import capitalizeFirstLetters from "../utilities/capitalize-first-letters";
import UserTag from "../components/user-tag";
import { Link } from "react-router";
import { MdArrowBack } from "react-icons/md";

export default function Leaderboard() {

    const [leaderboardData, setLeaderboardData] = useState(null);
    useEffect(() => {
        const fetchLeaderboard = async () => {
            const data = await getLeaderboard();

            setLeaderboardData(data);
        };

        fetchLeaderboard();
    }, []);

    console.log(leaderboardData);


    return (
        <>
            <Header title="Henrik.help"></Header>
            <main>
                <table className="border-1 text-sm [&_th,_td]:px-2 [&_th,_td]:py-2.5 w-full [&_tr]:border-b bg-white dark:bg-gray-700 rounded-xl overflow-hidden">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th>#</th>
                            <th>Bruger</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData && leaderboardData.map((user, index) => (
                            <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td className="truncate min-w-0">{<UserTag username={user.username} level={getLevel(user.exp)} group={user.group} shorten />}</td>
                                <td className="text-right !font-mono">{user.exp.toString().padStart(8, '0')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Link className="button-like mt-auto" to={-1}><MdArrowBack className="mr-1" size={20} />Tilbage</Link>


            </main>
        </>
    );
}