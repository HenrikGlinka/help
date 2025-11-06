import { useState, useEffect } from 'react';
import coinIcon from '../assets/images/shop/coin-icon.webp';

export default function CoinDisplay() {
    const [coins, setCoins] = useState(parseInt(localStorage.getItem('coins')) || 0);
    const [displayedCoins, setDisplayedCoins] = useState(0);

    // Animate the displayed value when coins change
    useEffect(() => {
        const duration = 500; // Animation duration in ms
        const steps = 100; // Number of animation steps
        const stepValue = (coins - displayedCoins) / steps;
        const stepDuration = duration / steps;
        
        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            setDisplayedCoins(prev => {
                const newValue = prev + stepValue;
                if (currentStep >= steps) {
                    clearInterval(timer);
                    return coins; // Ensure we end at exact value
                }
                return Math.floor(newValue);
            });
        }, stepDuration);

        return () => clearInterval(timer);
    }, [coins]);

    return (
        <p className="text-md !font-mono text-right flex items-center justify-end min-w-[calc(5ch+1.5rem)]">
            {displayedCoins} <img src={coinIcon} alt="Henrik Coins" className="h-6 inline-block ml-0.5" />
        </p>
    );
}