import { ConcessionEditBody } from "./ConcessionEditBody";
import { EditContextProvider } from "./EditContext";
import { EditList } from "./EditList";

export function ConcessionsEditView() {
    return (
        <EditContextProvider
            datapath="/concessions"
            itemsKey="concessions"
            nameKey="CName"
        >
            <EditList ItemFormComponent={ConcessionEditBody}/>
        </EditContextProvider>
    )
}