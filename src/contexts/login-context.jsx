import { createContext, use, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { getUserInfo } from "../helpers/api";
import { isSubscribedToNotifications } from "../utilities/push-notifications";
import { getLevel, getExpToPreviousLevel, getExpToNextLevel } from "../helpers/leveling";

const LoginContext = createContext();

export function LoginProvider({ children }) {
    const [data, setData] = useState(null);
    const [recievesNotifications, setRecievesNotifications] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [exp, setExp] = useState(0);
    const [level, setLevel] = useState(1);
    const [expToPrevious, setExpToPrevious] = useState(0);
    const [expToNext, setExpToNext] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (localStorage.getItem('token') !== null) update();
        else setIsLoading(false);
    }, []);

    useEffect(() => { if (!isLoading && !data) logout() }, [isLoading, data]);

    const update = async () => {

        const result = await getUserInfo();

        setExp(result.user?.exp || 0);
        setLevel(getLevel(result.user?.exp || 0));
        setExpToPrevious(getExpToPreviousLevel(result.user?.exp || 0));
        setExpToNext(getExpToNextLevel(result.user?.exp));

        setData(result.user);
        setRecievesNotifications(await isSubscribedToNotifications());
        /* localStorage.setItem('group', result.user?.group || 'all'); */
        setIsLoading(false);
    };

    const logout = () => {
        setData(null);
        localStorage.removeItem('token');
        /* localStorage.removeItem('group'); */
        if (location.pathname !== '/login') navigate('/login');
    }

    const tokenIsValid = async () => {
        const result = await getUserInfo();
        return result?.user !== undefined;
    }

    return (
        <LoginContext.Provider value={{ data, recievesNotifications, isLoading, exp, level, expToPrevious, expToNext, update, tokenIsValid, logout }}>
            {children}
        </LoginContext.Provider>
    );
}

export const useLogin = () => useContext(LoginContext);