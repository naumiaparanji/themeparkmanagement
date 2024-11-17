import {useCallback, useContext, useState} from "react";
import {EventsEditContext} from "./EventsEditContext";
import {Button, Container, Form, InputGroup, Navbar} from "react-bootstrap";
import {NewEventModal} from "./NewEventModal";

export function EventsTopBar() {
    const {search, setSearch, setActiveCategory, categories} = useContext(EventsEditContext);
    const [createState, setCreateState] = useState(false);

    const handleHide = useCallback(() => setCreateState(false), []);
    const handleAddEvent = useCallback(() => setCreateState(true), []);

    return (
        <>
            <Navbar>
                <Container fluid>
                    <Form className="w-100">
                        <InputGroup className="d-flex">
                            <Form.Control placeholder="Search" className="m-0" value={search}
                                          onChange={(event) => setSearch(event.target.value)}/>
                            <Form.Select style={{minWidth: 'fit-content', maxWidth: 'fit-content'}}
                                         onChange={(event) => setActiveCategory(Number(event.target.value))}>
                                <option value={-1} key={-1}>All</option>
                                {categories.map((category, i) => (
                                    <option value={i} key={i}>{category}</option>
                                ))}
                            </Form.Select>
                            <Button onClick={handleAddEvent}>Add new event</Button>
                        </InputGroup>
                    </Form>
                </Container>
            </Navbar>
            <NewEventModal show={createState} onHide={handleHide}/>
            <hr/>
        </>
    );
}