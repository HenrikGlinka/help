import { useEffect, useState } from "react";

export default function Timer({ startTime = "00:00", endCallback = () => { }, ...props }) {

    console.log(startTime);


    const [minutes, setMinutes] = useState(parseInt(startTime?.split(':')[0], 10));
    const [seconds, setSeconds] = useState(parseInt(startTime?.split(':')[1], 10));

    useEffect(() => {
        const interval = setInterval(() => {

            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(interval);
                    endCallback();
                } else {
                    setMinutes(prevMinutes => prevMinutes - 1);
                    setSeconds(59);
                }
            } else {
                setSeconds(prevSeconds => prevSeconds - 1);
            }

        }, 1000);

        return () => clearInterval(interval);
    }, [minutes, endCallback]);

    return (
        <span {...props}>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
    );
}