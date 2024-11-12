import { ConcessionForm } from "./ConcessionForm";
import { EditContextProvider } from "./EditContext";
import { EditList } from "./EditList";
import { EditTopBar } from "./EditTopBar";

export function ConcessionsEditView() {
    return (
        <EditContextProvider
            datapath="/concessions"
            itemsKey="concessions"
            nameKey="CName"
        >
            <EditTopBar entityName="item"/>
            <EditList ItemFormComponent={ConcessionForm}/>
        </EditContextProvider>
    )
}