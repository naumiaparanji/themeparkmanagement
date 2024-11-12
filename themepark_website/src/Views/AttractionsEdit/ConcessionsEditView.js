import { ConcessionForm } from "./ConcessionForm";
import { EditContextProvider } from "./EditContext";
import { EditFooter } from "./EditFooter";
import { EditList } from "./EditList";
import { EditTopBar } from "./EditTopBar";

export function ConcessionsEditView() {
    return (
        <EditContextProvider
            datapath="/concessions"
            itemsKey="concessions"
            nameKey="CName"
            idKey="ConcessionID"
        >
            <EditTopBar entityName="item"/>
            <EditList>
                <ConcessionForm/>
                <EditFooter/>
            </EditList>
        </EditContextProvider>
    )
}