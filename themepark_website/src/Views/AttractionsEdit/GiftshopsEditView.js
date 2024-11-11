import { useContext } from "react"
import { EditContext, EditContextProvider } from "./EditContext";

function PlaceholderList() {
    const { displayItems } = useContext(EditContext); 

    return (
        <>
        {
            displayItems.map((giftshop) => (
                <div>
                    {`Gift Shop ${giftshop.GiftshopID}: 
                    Opens ${giftshop.OpensAt} 
                    OpenFor ${giftshop.OpenDuration} 
                    Located@ ${giftshop.Location}`}
                </div>
            ))
        }
        </>
    )
}

export function GiftshopsEditView() {
    return (
        <EditContextProvider
            datapath="/giftshops"
            itemsKey="giftshops"
            searchKey="GName"
        >
            <PlaceholderList/>
        </EditContextProvider>
    )
}