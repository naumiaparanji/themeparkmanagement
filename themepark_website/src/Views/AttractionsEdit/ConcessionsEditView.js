import { ConcessionsEditContextProvider } from "./ConcessionsEditContext"
import { ConcessionsEditList } from "./ConcessionsEditList";

export function ConcessionsEditView() {
    return (
        <ConcessionsEditContextProvider>
            <ConcessionsEditList />
        </ConcessionsEditContextProvider>
    )
}