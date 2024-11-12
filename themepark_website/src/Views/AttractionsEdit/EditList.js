import { useContext } from "react";
import { EditContext } from "./EditContext";
import { Accordion } from "react-bootstrap";
import { ItemEditContextProvider } from "./ItemEditContext";

export function EditList({children}) {
    const { displayItems, nameKey } = useContext(EditContext);
    return (
        <div>
        {
            displayItems? (
                <Accordion defaultActiveKey={-1} className="accordion-flush">
                    {displayItems.map((item, i) => (
                        <Accordion.Item eventKey={i} key={i}>
                            <Accordion.Header className="py-0">
                                <div className="w-100 d-flex justify-content-between align-items-center">
                                    <center>
                                        {item[nameKey]}
                                    </center>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <ItemEditContextProvider item={item} eventKey={i}>
                                    {children}
                                </ItemEditContextProvider>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
             ) : (
                "Loading..."
             )
        }
        </div>
    );
}