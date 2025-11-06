import { useState } from "react";
import coinIcon from '../assets/images/shop/coin-icon.webp';
import coinsSmall from '../assets/images/shop/coins-small.webp';
import coinsMedium from '../assets/images/shop/coins-medium.webp';
import coinsLarge from '../assets/images/shop/coins-large.webp';
import Timer from "./timer";


export default function CoinOffer() {

    const [shownBefore, setShownBefore] = useState(localStorage.getItem('coin-offer') === 'true');

    const hideOffer = () => {
        localStorage.setItem('coin-offer', 'true');
        setShownBefore(true);
    }

    if (shownBefore) return null;

    return (
        <>
            <div className="bg-yellow-600 text-white p-3 rounded-lg shadow-md space-y-4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-1rem)] md:max-w-2xl z-50">
                <h2 className="text-2xl flex items-center justify-between my-0 animate-[pulse_1s_infinite]">
                    <img src={coinIcon} alt="Henrik Coins" className="h-8 inline-block" />
                    <span className="font-bold">Tilbud på HenrikCoins!</span>
                    <img src={coinIcon} alt="Henrik Coins" className="h-8 inline-block" />
                </h2>
                <p className="text-center text-sm m-0">Kun i de næste <Timer className="text-red-700 bold" startTime="03:00" onEnd={hideOffer} /> minutter!</p>
                <ul className="
                flex gap-2 text-sm flex-col md:flex-row justify-stretch items-stretch
                [&_h3]:text-xl [&_p]:text-center [&_p]:text-xl
                marker:text-blue-500 marker:block
                [&_li_ul]:mx-auto[&_li_ul]:-indent-2 [&_li]:flex-1 [&_li]:pl-3 [&_li]:items-center [&_li>img]:h-20 [&_li>img]:w-auto
                [&_li]:flex [&_li]:flex-col [&_li]:gap-2 [&_li]:justify-between  [&_li]:items-center
                [&_li_small]:-rotate-2 [&_li_small]:text-green-500 [&_li_small]:-mt-3 [&_li_small]:text-center
                [&_button]:mt-auto [&_button]:w-full
                ">
                    <li className="bg-blue-950 p-2 rounded-lg">
                        <img src={coinsSmall} alt="En lille bunke Henrik Coins" />
                        <h3>500<img src={coinIcon} alt="Henrik Coins" className="h-5 inline-block ml-0.5" /></h3>
                        <button onClick={() => { localStorage.setItem('coins', 500); hideOffer(); }}>10 kr</button>
                    </li>
                    <li className="bg-blue-950 p-2 rounded-lg">
                        <img src={coinsMedium} alt="En mellem bunke Henrik Coins" />
                        <h3>3000<img src={coinIcon} alt="Henrik Coins" className="h-5 inline-block ml-0.5" /></h3>
                        <small>Den mest populære!</small>
                        <button onClick={() => { localStorage.setItem('coins', 3000); hideOffer(); }}>99 kr</button>
                    </li>
                    <li className="bg-blue-950 p-2 rounded-lg">
                        <img src={coinsLarge} alt="En stor bunke Henrik Coins" />
                        <h3>15000<img src={coinIcon} alt="Henrik Coins" className="h-5 inline-block ml-0.5" /></h3>
                        <small>Maksimal værdi for pengene!</small>
                        <button onClick={() => { localStorage.setItem('coins', 15000); hideOffer(); }}>799 kr</button>
                    </li>
                </ul>



            </div>
            <div
                className="fixed z-10 top-0 left-0 w-screen h-screen bg-gray-500/50 backdrop-blur-xs animate-[var(--animate-fade-in)]"
            />
        </>
    );
}