import { useState } from "react";
import { IoWarning } from "react-icons/io5";

export default function SpecialOffer() {

    const [shownBefore, setShownBefore] = useState(localStorage.getItem('special-offer') === 'true');

    const hideOffer = () => {
        localStorage.setItem('special-offer', 'true');
        setShownBefore(true);
    }

    if (shownBefore) return null;

    return (
        <>
            <div className="bg-orange-950 text-white p-3 rounded-lg shadow-md space-y-4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:max-w-3xl z-50">
                <h2 className="text-2xl flex items-center justify-center animate-[pulse_1s_infinite]">
                    <IoWarning className="inline-block mr-2" size={40} />
                    Din gratis prøveperiode er ved at udløbe!
                    <IoWarning className="inline-block ml-2" size={40} />
                </h2>
                <p className="text-center">Opgrader til <span className="font-bold uppercase">Henrik premium</span> for at få fuld adgang:</p>
                <ul className="
                flex gap-2 text-sm flex-col md:flex-row justify-center
                [&_h3]:text-xl [&_p]:text-center [&_p]:text-xl
                [&_label_ul]:list-['✓']
                marker:text-blue-500 marker:block
                [&_label_ul]:mx-auto[&_label_ul]:-indent-2 [&_label_li]:pl-3 [&_label_li]:ml-4
                [&_label]:flex [&_label]:flex-col [&_label]:gap-2 [&_label]:justify-between [&_label]:h-full
                [&_label_small]:-rotate-2 [&_label_small]:text-green-500 [&_label_small]:-mt-3 [&_label_small]:text-center
                [&_button]:mt-auto
                ">
                    <li className="bg-cyan-950 p-2 rounded-lg">
                        <label>
                            <h3>👶 Henrik Basic</h3>
                            <small>Perfekt til de fattige!</small>
                            <p className="price"><del className="text-xs">49</del> 19 kr./md.</p>
                            <input type="radio" name="special-offer" className="hidden" />
                            <ul>
                                <li>Adgang til mange funktioner</li>
                                <li>Op til 20 spørgsmål pr. måned</li>
                            </ul>
                            <button className="cancel" onClick={hideOffer}>Vælg</button>
                        </label>
                    </li>
                    <li className="bg-blue-950 p-2 rounded-lg">
                        <label>
                            <h3>⭐ Henrik Pro</h3>
                            <small>Den mest populære!</small>
                            <p className="price"><del className="text-xs">249</del> 99 kr./md.</p>
                            <input type="radio" name="special-offer" className="hidden" />
                            <ul>
                                <li>Adgang til de fleste funktioner</li>
                                <li>Op til 60 spørgsmål pr. måned</li>
                                <li>Prioriteret support</li>
                            </ul>
                            <button onClick={hideOffer}>Vælg</button>
                        </label>
                    </li>
                    <li className="bg-purple-950 p-2 rounded-lg">
                        <label>
                            <h3>🚀 Henrik Ultra+</h3>
                            <small>Maksimal værdi for pengene!</small>
                            <p className="price"><del className="text-xs">2299</del> 999 kr./md.</p>
                            <input type="radio" name="special-offer" className="hidden" />
                            <ul>
                                <li>Adgang til alle funktioner</li>
                                <li>Ubegrænsede spørgsmål</li>
                                <li>24/7 VIP support</li>
                                <li>10% rabat på merchandise</li>
                            </ul>
                            <button className="animate-[bounce_.5s_infinite] approve" onClick={hideOffer}>Vælg</button>
                        </label>
                    </li>
                </ul>



            </div>
            <div
                className="fixed z-10 top-0 left-0 w-screen h-screen bg-gray-500/50 backdrop-blur-xs animate-[var(--animate-fade-in)]"
            />
        </>
    );
}