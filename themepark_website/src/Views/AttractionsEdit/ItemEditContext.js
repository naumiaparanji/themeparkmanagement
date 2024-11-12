import React, { useState } from "react";

export const ItemEditContext = React.createContext();

export function ItemEditContextProvider({item, eventKey, children}) {
    const [ editState, setEditState ] = useState(null);

    return (
        <ItemEditContext.Provider value={{
            item,
            eventKey,
            editState,
            setEditState
        }}>
            {children}
        </ItemEditContext.Provider>
    );
}