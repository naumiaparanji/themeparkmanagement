import { EditContextProvider } from "./EditContext";
import { EditTopBar } from "./EditTopBar";
import { EditList } from "./EditList";
import { GiftshopForm } from "./GiftshopForm";
import { EditFooter } from "./EditFooter";

export function GiftshopsEditView() {
    return (
        <EditContextProvider
            datapath="/giftshops"
            itemsKey="giftshops"
            nameKey="GName"
            idKey="GiftshopID"
        >
            <EditTopBar entityName="item"/>
            <EditList>
                <GiftshopForm/>
                <EditFooter/>
            </EditList>
        </EditContextProvider>
    )
}