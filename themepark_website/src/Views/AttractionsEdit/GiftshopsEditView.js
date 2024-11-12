import { EditContextProvider } from "./EditContext";
import { EditTopBar } from "./EditTopBar";
import { EditList } from "./EditList";
import { GiftshopForm } from "./GiftshopForm";

export function GiftshopsEditView() {
    return (
        <EditContextProvider
            datapath="/giftshops"
            itemsKey="giftshops"
            nameKey="GName"
        >
            <EditTopBar entityName="item"/>
            <EditList>
                <GiftshopForm/>
            </EditList>
        </EditContextProvider>
    )
}