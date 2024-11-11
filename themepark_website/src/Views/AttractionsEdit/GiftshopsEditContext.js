import React, { useCallback, useEffect, useState } from "react";
import { api } from "../../App";

export const GiftshopsEditContext = React.createContext();

export function GiftshopsEditContextProvider({children}) {
    const [giftshops, setGiftshops] = useState([]);

    const refreshGiftshops = useCallback(() => {
        api.get("/giftshops")
        .then((response) => {
            setGiftshops(response.data.giftshops);
        })
        .catch((e) => console.log(e));
    }, []);

    useEffect(() => {
        refreshGiftshops();
    }, [refreshGiftshops]);

    return (
        <GiftshopsEditContext.Provider value={{
            giftshops,
            setGiftshops,
            refreshGiftshops
        }}>
            {children}
        </GiftshopsEditContext.Provider>
    );
}