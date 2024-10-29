import React, { useEffect, useState } from "react";
import { api } from "./App";

export const ApiContext = React.createContext();

export function ApiContextProvider({apiPath, apiFailureAction, blockRendering, children}) {
    const [data, setData] = useState(null);

    useEffect(() => {
        api.get(apiPath)
        .then((res) => setData(res.data))
        .catch((e) => {
            console.error(e);
            apiFailureAction();
        });
    }, [apiPath, apiFailureAction]);

    return (
        <ApiContext.Provider value={{data, setData}}>
            {blockRendering && !data? null : children}
        </ApiContext.Provider>
    );
};
