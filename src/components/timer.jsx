import { useEffect, useState } from "react";

export default function Timer({ startTime = "00:00", onEnd = () => { }, ...props }) {

    const [minutes, setMinutes] = useState(parseInt(startTime?.split(':')[0], 10));
    const [seconds, setSeconds] = useState(parseInt(startTime?.split(':')[1], 10));

    useEffect(() => {
        const interval = setInterval(() => {

            setSeconds(prevSeconds => {

                if (prevSeconds === 0) {
                    
                    setMinutes(prevMinutes => {
                        if (prevMinutes === 0) {
                            clearInterval(interval);
                            setTimeout(onEnd, 0);
                        } else {
                            setSeconds(59);
                            return prevMinutes - 1;
                        }
                    });

                    return prevSeconds;
                }

                return prevSeconds - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <span {...props}>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
    );
}