import { ConcessionEditBody } from "./ConcessionEditBody";
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
            <EditTopBar entityName="concession"/>
            <EditList ItemFormComponent={ConcessionEditBody}/>
        </EditContextProvider>
    )
}