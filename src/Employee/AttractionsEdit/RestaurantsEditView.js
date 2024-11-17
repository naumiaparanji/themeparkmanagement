import {EditContextProvider} from "./EditContext"
import {EditTopBar} from "./EditTopBar";
import {EditList} from "./EditList";
import {RestaurantForm} from "./RestaurantForm";
import {EditFooter} from "./EditFooter";
import {useCallback, useState} from "react";
import {NewItemModal} from "./NewItemModal";

export function RestaurantsEditView() {
    const [showNew, setShowNew] = useState(false);

    const handleShowNew = useCallback(() => setShowNew(true), []);
    const handleHideNew = useCallback(() => setShowNew(false), []);

    return (
        <EditContextProvider
            datapath="/restaurants"
            itemsKey="restaurants"
            nameKey="RName"
            idKey="RestaurantID"
        >
            <EditTopBar entityName="item" addNewAction={handleShowNew}/>
            <EditList>
                <RestaurantForm/>
                <EditFooter/>
            </EditList>
            <NewItemModal show={showNew} onHide={handleHideNew}>
                <RestaurantForm/>
            </NewItemModal>
        </EditContextProvider>
    )
}