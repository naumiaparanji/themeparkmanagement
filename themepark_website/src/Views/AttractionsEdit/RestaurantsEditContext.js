import React, { useCallback, useEffect, useState } from "react";
import { api } from "../../App";

export const RestaurantsEditContext = React.createContext();

export function RestaurantsEditContextProvider({children}) {
    const [restaurants, setRestaurants] = useState([]);

    const refreshRestaurants = useCallback(() => {
        api.get("/restaurants")
        .then((response) => {
            setRestaurants(response.data.restaurants);
        })
        .catch((e) => console.log(e));
    }, []);

    useEffect(() => {
        refreshRestaurants();
    }, [refreshRestaurants]);

    return (
        <RestaurantsEditContext.Provider value={{
            restaurants,
            setRestaurants,
            refreshRestaurants
        }}>
            {children}
        </RestaurantsEditContext.Provider>
    );
}