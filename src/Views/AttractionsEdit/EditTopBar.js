import { useContext, useCallback } from "react";
import { EditContext } from "./EditContext";
import { Navbar, Container, Form, InputGroup, Button } from "react-bootstrap";

export function EditTopBar({addNewAction, entityName}) {
    const { search, setSearch } = useContext(EditContext);

    const handleChange = useCallback((event) => {
        setSearch(event.target.value);
    }, [setSearch]);

    return (
        <>
            <Navbar>
                <Container fluid>
                    <Form className="w-100">
                        <InputGroup className="d-flex">
                            <Form.Control placeholder="Search" className="m-0" value={search} onChange={handleChange}/>
                            <Button onClick={addNewAction}>Add new {entityName}</Button>
                        </InputGroup>
                    </Form>
                </Container>
            </Navbar>
            <hr className="m-0"/>
        </>
    )
}