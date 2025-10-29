import { Alert, AlertTitle } from "@mui/material";
import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export function AlertProvider({ children }) {

    const [alert, setAlert] = useState(null);

    let timeout = null;

    const show = (title, message, options = {duration: 5000, severity: "info"}) => {
        setAlert({ severity: options.severity, title, message });
        timeout = setTimeout(setAlert, options.duration, null);
    };

    const info = (title, message, options = {duration: 5000}) => show(title, message, { ...options, severity: "info" });
    const success = (title, message, options = {duration: 5000}) => show(title, message, { ...options, severity: "success" });
    const warning = (title, message, options = {duration: 5000}) => show(title, message, { ...options, severity: "warning" });
    const error = (title, message, options = {duration: 5000}) => show(title, message, { ...options, severity: "error" });

    const hide = () => {
        clearTimeout(timeout);
        setAlert(null);
    }

    return (
        <AlertContext.Provider value={{ show, info, success, warning, error, hide }}>
            {children}
            {alert && (
                <Alert variant="filled" severity={alert.severity}>
                    {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
                    {alert.message}
                </Alert>
            )}
        </AlertContext.Provider>
    );
}

export const useAlert = () => useContext(AlertContext);
