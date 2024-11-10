import { useContext } from "react"
import { ConcessionsEditContext, ConcessionsEditContextProvider } from "./ConcessionsEditContext"

function PlaceholderList() {
    const { concessions } = useContext(ConcessionsEditContext); 

    return (
        <>
        {
            concessions.map((concession) => (
                <div>
                    {`Concession ${concession.ConcessionID}: 
                    Opens ${concession.OpensAt} 
                    OpenFor ${concession.OpenDuration} 
                    Located@ ${concession.Location}`}
                </div>
            ))
        }
        </>
    )
}

export function ConcessionsEditView() {
    return (
        <ConcessionsEditContextProvider>
            <PlaceholderList/>
        </ConcessionsEditContextProvider>
    )
}