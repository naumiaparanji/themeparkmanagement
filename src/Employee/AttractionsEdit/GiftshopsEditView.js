import {EditContextProvider} from "./EditContext";
import {EditTopBar} from "./EditTopBar";
import {EditList} from "./EditList";
import {GiftshopForm} from "./GiftshopForm";
import {EditFooter} from "./EditFooter";
import {useCallback, useState} from "react";
import {NewItemModal} from "./NewItemModal";

export function GiftshopsEditView() {
    const [showNew, setShowNew] = useState(false);

    const handleShowNew = useCallback(() => setShowNew(true), []);
    const handleHideNew = useCallback(() => setShowNew(false), []);

    return (
        <EditContextProvider
            datapath="/giftshops"
            itemsKey="giftshops"
            nameKey="GName"
            idKey="GiftshopID"
        >
            <EditTopBar entityName="item" addNewAction={handleShowNew}/>
            <EditList>
                <GiftshopForm/>
                <EditFooter/>
            </EditList>
            <NewItemModal show={showNew} onHide={handleHideNew}>
                <GiftshopForm/>
            </NewItemModal>
        </EditContextProvider>
    )
}