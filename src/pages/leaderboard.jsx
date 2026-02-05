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
                <table className="border-1 text-sm [&_th,_td]:first:pl-2 [&_th,_td]:last:pr-2 [&_th,_td]:py-2.5 w-full [&_tr]:border-b bg-white dark:bg-gray-700 rounded-xl overflow-hidden">
                    <thead>
                        <tr className="bg-gray-400 dark:bg-gray-800 text-white">
                            <th className="pr-4 text-left w-[10%]">#</th>
                            <th colSpan={2} className="w-[100%]">Bruger</th>
                            <th className="text-right w-[0%]">Point</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData ? leaderboardData.map((user, index) => (
                            <tr key={index}>
                                <td className="font-bold">{index + 1}</td>
                                <td><Link to={`/profile/${user._id}`}><UserTag username={user.username} level={getLevel(user.exp)} group={user.group} shorten /></Link></td>
                                <td colSpan={2} className="text-right !font-mono">{user.exp}</td>
                            </tr>
                        )) : Array.from({ length: 10 }).map((_, index) => (
                            <tr key={index} className="animate-[var(--animate-loading)]"><td className="text-center">{index + 1}</td><td className="px-4">&nbsp;</td><td className="text-right !font-mono w-0" colSpan={2}>-</td></tr>
                        ))

                    
                    }
                    </tbody>
                </table>

                <Link className="button-like mt-auto" to={-1}><MdArrowBack className="mr-1" size={20} />Tilbage</Link>


            </main>
        </>
    );
}