import React, { useCallback, useEffect, useState } from "react";
import { api } from "../../App";

export const ConcessionsEditContext = React.createContext();

export function ConcessionsEditContextProvider({children}) {
    const [concessions, setConcessions] = useState([]);

    const refreshConcessions = useCallback(() => {
        api.get("/concessions")
        .then((response) => {
            setConcessions(response.data.concessions);
        })
        .catch((e) => console.log(e));
    }, []);

    useEffect(() => {
        refreshConcessions();
    }, [refreshConcessions]);

    return (
        <ConcessionsEditContext.Provider value={{
            concessions,
            setConcessions,
            refreshConcessions
        }}>
            {children}
        </ConcessionsEditContext.Provider>
    );
}