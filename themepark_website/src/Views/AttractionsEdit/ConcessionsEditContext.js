import React, { useCallback, useEffect, useState } from "react";
import { api } from "../../App";

export const ConcessionsEditContext = React.createContext();

export function ConcessionsEditContextProvider({children}) {
    const [concessions, setConcessions] = useState([]);
    const [displayConcessions, setDisplayConcessions] = useState([]);
    const [search, setSearch] = useState("");

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

    useEffect(() => {
        let newConcessions = concessions;
        if (search) {
            newConcessions = newConcessions.filter((concession) => concession.CName.toLowerCase().indexOf(search.toLowerCase()) !== -1);
        }
        setDisplayConcessions(newConcessions);
    }, [search, concessions]);

    return (
        <ConcessionsEditContext.Provider value={{
            concessions,
            setConcessions,
            refreshConcessions,
            search,
            setSearch,
            displayConcessions
        }}>
            {children}
        </ConcessionsEditContext.Provider>
    );
}