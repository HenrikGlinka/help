import coinIcon from '../assets/images/shop/coin-icon.webp';

export default function CoinDisplay() {
    return (
        <p className="text-xl text-right flex items-center justify-end min-w-[4ch]">
            0 <img src={coinIcon} alt="Henrik Coins" className="h-6 inline-block ml-0.5" />
        </p>
    );
}