import { useContext } from "react"
import { GiftshopsEditContext, GiftshopsEditContextProvider } from "./GiftshopsEditContext";

function PlaceholderList() {
    const { giftshops } = useContext(GiftshopsEditContext); 

    return (
        <>
        {
            giftshops.map((giftshop) => (
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
        <GiftshopsEditContextProvider>
            <PlaceholderList/>
        </GiftshopsEditContextProvider>
    )
}