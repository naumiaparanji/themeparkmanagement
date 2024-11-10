import { useContext } from "react"
import { RestaurantsEditContext, RestaurantsEditContextProvider } from "./RestaurantsEditContext"

function PlaceholderList() {
    const { restaurants } = useContext(RestaurantsEditContext);

    return (
        <>
        {
            restaurants.map((restaurant) => (
                <div>
                    {`Restaurant ${restaurant.RestaurantID}: 
                    Capacity ${restaurant.SeatingCapacity} 
                    Opens ${restaurant.OpensAt} 
                    OpenFor ${restaurant.OpenDuration} 
                    Located@ ${restaurant.Location}`}
                </div>
            ))
        }
        </>
    )
}

export function RestaurantsEditView() {
    return (
        <RestaurantsEditContextProvider>
            <PlaceholderList/>
        </RestaurantsEditContextProvider>
    )
}