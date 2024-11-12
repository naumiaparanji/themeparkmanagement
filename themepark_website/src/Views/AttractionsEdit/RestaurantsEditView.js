import { EditContextProvider } from "./EditContext"
import { EditTopBar } from "./EditTopBar";
import { EditList } from "./EditList";
import { RestaurantForm } from "./RestaurantForm";
import { EditFooter } from "./EditFooter";

export function RestaurantsEditView() {
    return (
        <EditContextProvider
            datapath="/restaurants"
            itemsKey="restaurants"
            nameKey="RName"
            idKey="RestaurantID"
        >
            <EditTopBar entityName="item"/>
            <EditList>
                <RestaurantForm />
                <EditFooter/>
            </EditList>
        </EditContextProvider>
    )
}