import { EditContextProvider } from "./EditContext";
import { ConcessionsEditList } from "./ConcessionsEditList";

export function ConcessionsEditView() {
    return (
        <EditContextProvider
            datapath="/concessions"
            itemsKey="concessions"
            searchKey="CName"
        >
            <ConcessionsEditList />
        </EditContextProvider>
    )
}