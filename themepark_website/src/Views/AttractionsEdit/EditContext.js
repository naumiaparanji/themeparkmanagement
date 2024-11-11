import React, { useCallback, useEffect, useState } from "react";
import { api } from "../../App";

export const EditContext = React.createContext();

export function EditContextProvider({datapath, itemsKey, searchKey, children}) {
    const [items, setItems] = useState([]);
    const [displayItems, setDisplayItems] = useState([]);
    const [search, setSearch] = useState("");

    const refreshItems = useCallback(() => {
        api.get(datapath)
        .then((response) => {
            setItems(response.data[itemsKey]);
        })
        .catch((e) => console.log(e));
    }, [datapath, itemsKey]);

    useEffect(() => {
        refreshItems();
    }, [refreshItems]);

    useEffect(() => {
        let newItems = items;
        if (search) {
            newItems = newItems.filter((item) => item[searchKey].toLowerCase().indexOf(search.toLowerCase()) !== -1);
        }
        setDisplayItems(newItems);
    }, [search, items, searchKey]);

    return (
        <EditContext.Provider value={{
            items,
            setItems,
            refreshItems,
            search,
            setSearch,
            displayItems
        }}>
            {children}
        </EditContext.Provider>
    );
}