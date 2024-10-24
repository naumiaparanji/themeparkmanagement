import React, { useEffect, useState } from "react";
import { apiGet } from "./CRUDApi";

export const ApiContext = React.createContext();

export function ApiContextProvider({apiPath, apiFailureAction, children}) {
    const [data, setData] = useState(null);

    useEffect(() => {
        const getInfo = async () => {
            const response = await apiGet(apiPath)
            .catch((e) => console.log(e));
            if ((!response || response.code !== 200) && apiFailureAction) {
                apiFailureAction();
            } else setData(response.body);
        }
        getInfo().catch((e) => console.log(e)); // should not happen afaik
    }, [apiPath, apiFailureAction]);

    return (
        <ApiContext.Provider value={{data, setData}}>
            {children}
        </ApiContext.Provider>
    );
};
