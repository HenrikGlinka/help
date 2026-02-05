import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Captcha({ setRisk }) {

    const [token, setToken] = useState('');

    useEffect(() => {
        const verifyToken = async () => {

            if (!token) return;

            const url = new URL(import.meta.env.VITE_RECAPTCHA_VERIFY_URL);
            const body = {
                event: {
                    token,
                    expectedAction: "USER_ACTION",
                    siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
                }
            };

            url.searchParams.append('key', import.meta.env.VITE_RECAPTCHA_API_KEY);

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const result = await response.json();

            console.log(result);
            
            setRisk(result);
        }
        verifyToken();
    }, [token]);

    return (
        <ReCAPTCHA
            className="mx-auto"
            theme={localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'}
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={value => setToken(value)}
        />
    )
}