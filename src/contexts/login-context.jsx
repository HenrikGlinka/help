import { createContext, use, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getUserInfo } from "../helpers/api";
import { isSubscribedToNotifications } from "../utilities/push-notifications";

const LoginContext = createContext();

export function LoginProvider({ children }) {
    const [data, setData] = useState(null);
    const [recievesNotifications, setRecievesNotifications] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => { if (localStorage.getItem('token') !== null) update() }, []);
    useEffect(() => { if (!isLoading && !data) logout() }, [isLoading, data]);

    const update = async () => {

        const result = await getUserInfo();

        setData(result.user);
        setRecievesNotifications(await isSubscribedToNotifications());
        localStorage.setItem('group', result.user?.group || 'all');
        setIsLoading(false);
    };

    const logout = () => {
        setData(null);
        localStorage.removeItem('token');
        navigate('/login');
    }

    const tokenIsValid = async () => {
        const result = await getUserInfo();
        return result?.user !== undefined;
    }


    return (
        <LoginContext.Provider value={{ data, recievesNotifications, isLoading, update, tokenIsValid, logout }}>
            {children}
        </LoginContext.Provider>
    );
}

export const useLogin = () => useContext(LoginContext);