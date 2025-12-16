import { useEffect, useState } from "react";
import Header from "../components/header";
import { getLeaderboard } from "../helpers/api";
import { getLevel } from "../helpers/leveling";
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

    return (
        <>
            <Header title="Henrik.help"></Header>
            <main>
                <table className="border-1 text-sm [&_th,_td]:first:pl-5 [&_th,_td]:last:pr-5 [&_th,_td]:py-2.5 w-full [&_tr]:border-b bg-white dark:bg-gray-700 rounded-xl overflow-hidden">
                    <thead>
                        <tr className="bg-gray-400 dark:bg-gray-800 text-white">
                            <th>#</th>
                            <th >Bruger</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData && leaderboardData.map((user, index) => (
                            <tr key={index}>
                                <td className="text-center w-0">{index + 1}</td>
                                <td className="px-4">{<UserTag username={user.username} level={getLevel(user.exp)} group={user.group} shorten />}</td>
                                <td className="text-right !font-mono w-0">{user.exp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Link className="button-like mt-auto" to={-1}><MdArrowBack className="mr-1" size={20} />Tilbage</Link>


            </main>
        </>
    );
}