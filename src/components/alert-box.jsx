import { createContext, useContext, useState } from 'react';
import { Alert, AlertTitle } from '@mui/material';

const AlertContext = createContext();

export function AlertProvider({ children }) {
    const [alert, setAlert] = useState(null);

    const showAlert = (severity, title, message) => {
        setAlert({ severity, title, message });
    };

    const hideAlert = () => {
        setAlert(null);
    };

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            {alert && (
                <Alert variant="filled" severity={alert.severity} onClose={hideAlert}>
                    {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
                    {alert.message}
                </Alert>
            )}
        </AlertContext.Provider>
    );
}

export const useAlert = () => useContext(AlertContext);

export default function AlertBox({ severity = 'info', title = '', children = null }) {

    if (children === null ) return null;

    return (
        <Alert variant="filled" severity={severity}>
            <AlertTitle>{title}</AlertTitle>
            {children}
        </Alert>
    );
}