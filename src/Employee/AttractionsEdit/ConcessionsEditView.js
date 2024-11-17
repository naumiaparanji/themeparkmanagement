import {useCallback, useState} from "react";
import {ConcessionForm} from "./ConcessionForm";
import {EditContextProvider} from "./EditContext";
import {EditFooter} from "./EditFooter";
import {EditList} from "./EditList";
import {EditTopBar} from "./EditTopBar";
import {NewItemModal} from "./NewItemModal";

export function ConcessionsEditView() {
    const [showNew, setShowNew] = useState(false);

    const handleShowNew = useCallback(() => setShowNew(true), []);
    const handleHideNew = useCallback(() => setShowNew(false), []);

    return (
        <EditContextProvider
            datapath="/concessions"
            itemsKey="concessions"
            nameKey="CName"
            idKey="ConcessionID"
        >
            <EditTopBar entityName="item" addNewAction={handleShowNew}/>
            <EditList>
                <ConcessionForm/>
                <EditFooter/>
            </EditList>
            <NewItemModal show={showNew} onHide={handleHideNew}>
                <ConcessionForm/>
            </NewItemModal>
        </EditContextProvider>
    )
}