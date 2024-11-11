import { useContext } from "react";
import { EditContext } from "./EditContext";
import { ConcessionEditBody } from "./ConcessionEditBody";
import { Accordion } from "react-bootstrap";

export function ConcessionsEditList() {
    const { displayItems } = useContext(EditContext);
    return (
        <div>
        {
            displayItems? (
                <Accordion defaultActiveKey={-1} className="accordion-flush">
                    {displayItems.map((concession, i) => (
                        <Accordion.Item eventKey={i} key={i}>
                            <Accordion.Header className="py-0">
                                <div className="w-100 d-flex justify-content-between align-items-center">
                                    <center>
                                        {concession.CName}
                                    </center>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <ConcessionEditBody concession={concession} eventKey={i}/>
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