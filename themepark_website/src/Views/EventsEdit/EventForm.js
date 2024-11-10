import { useContext, useCallback } from "react";
import { EventsEditContext } from "./EventsEditContext";
import { Form, InputGroup } from "react-bootstrap";

export function EventForm() {
    const { formEditState, setFormEditState } = useContext(EventsEditContext);

    const handleChange = useCallback((e) => {
        let { name, value } = e.target;
        setFormEditState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, [setFormEditState]);

    return (
        <Form>
            <Form.Text className="mx-0">Name</Form.Text>
            <Form.Control className="mx-0" placeholder="Event name" value={formEditState.EventName} name="EventName" onChange={handleChange}/>
            <Form.Text className="mx-0">Type</Form.Text>
            <Form.Control className="mx-0" placeholder="Event type" value={formEditState.EventType} name="EventType" onChange={handleChange}/>
            <Form.Text className="mx-0">Description</Form.Text>
            <Form.Control className="mx-0" as="textarea" value={formEditState.EventDesc} name="EventDesc" onChange={handleChange}/>
            <Form.Text className="mx-0">Restrictions</Form.Text>
            <Form.Control className="mx-0" placeholder="Event restrictions" value={formEditState.EventRestrictions} name="EventRestrictions" onChange={handleChange}/>
            <Form.Text className="mx-0">Age Limit</Form.Text>
            <Form.Control className="mx-0" type="number" value={formEditState.EventAgeLimit} name="EventAgeLimit" onChange={handleChange} min={1}/>
            <Form.Text className="mx-0">Location</Form.Text>
            <Form.Control className="mx-0" value={formEditState.Location} name="Location" onChange={handleChange}/>
            <Form.Text className="mx-0">Capacity</Form.Text>
            <Form.Control className="mx-0" type="number" value={formEditState.Capacity} name="Capacity" onChange={handleChange} min={1}/>
            <Form.Text className="mx-0">Time</Form.Text>
            <InputGroup>
                <Form.Control className="mx-0" type="time" value={formEditState.startTime} name="startTime" onChange={handleChange}/>
                <Form.Control className="mx-0" type="time" value={formEditState.endTime} name="endTime" onChange={handleChange}/>
            </InputGroup>
        </Form>
    );
}