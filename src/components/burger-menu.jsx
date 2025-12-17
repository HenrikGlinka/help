import { useRef, useState } from "react";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";

export default function BurgerMenu({ children }) {

    const [isOpen, setIsOpen] = useState(false);
    const nav = useRef();
    const backdrop = useRef();

    const toggleMenu = () => {
        if (isOpen) {
            nav.current.style.animation = 'var(--animate-slide-out-left)';
            backdrop.current.style.animation = 'var(--animate-fade-out)';
            setTimeout(() => setIsOpen(false), 300);
        } else {
            setIsOpen(true);
        }
    }

    return (
        <div>
            <button className="!bg-transparent !border-gray-400 !p-1" onClick={toggleMenu}>
                <SlMenu className="fill-black dark:fill-white" size={30} />
            </button>
            {isOpen &&
                <>
                    <nav ref={nav} className={`
                        animate-[var(--animate-slide-in-left)]
                        top-1 left-1 p-2 pb-4 bg-white dark:bg-black border-1 rounded shadow-lg z-10 fixed
                        w-[calc(100%-.5rem)] max-w-3xs
                    `}>
                        <ul className="flex flex-col gap-2 z-50">
                            <li><button
                                onClick={toggleMenu}
                                className="!bg-transparent border-1 !border-gray-400 self-end mt-0.5 mb-4 !p-2"
                            ><VscChromeClose className="fill-gray-500" size="20" /></button></li>
                            {[...children].map((child, index) => { if (child) return <li key={index}>{child}</li> })}
                        </ul>
                    </nav>
                    <div
                        ref={backdrop}
                        onClick={toggleMenu}
                        className="fixed top-0 left-0 w-screen h-screen bg-white/50 dark:bg-black/50 backdrop-blur-xs animate-[var(--animate-fade-in)]"
                    />
                </>

            }
        </div>
    )
}