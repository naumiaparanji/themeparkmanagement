import { useContext } from "react"
import { EditContext, EditContextProvider } from "./EditContext"

function PlaceholderList() {
    const { displayItems } = useContext(EditContext)

    return (
        <>
        {
            displayItems.map((restaurant) => (
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
        <EditContextProvider
            datapath="/restaurants"
            itemsKey="restaurants"
            nameKey="RName"
        >
            <PlaceholderList/>
        </EditContextProvider>
    )
}