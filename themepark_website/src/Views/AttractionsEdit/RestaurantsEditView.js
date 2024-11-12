import { EditContextProvider } from "./EditContext"
import { EditTopBar } from "./EditTopBar";
import { EditList } from "./EditList";
import { RestaurantForm } from "./RestaurantForm";

export function RestaurantsEditView() {
    return (
        <EditContextProvider
            datapath="/restaurants"
            itemsKey="restaurants"
            nameKey="RName"
        >
            <EditTopBar entityName="item"/>
            <EditList ItemFormComponent={RestaurantForm}/>
        </EditContextProvider>
    )
}