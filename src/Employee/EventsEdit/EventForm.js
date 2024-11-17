import {useCallback} from "react";
import {Form, InputGroup} from "react-bootstrap";

export function EventForm({formState, setFormState}) {

    const handleChange = useCallback((e) => {
        let {name, value} = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, [setFormState]);

    return (
        <Form>
            <Form.Text className="mx-0">Name</Form.Text>
            <Form.Control className="mx-0" placeholder="Event name" value={formState.EventName} name="EventName"
                          onChange={handleChange}/>
            <Form.Text className="mx-0">Type</Form.Text>
            <Form.Control className="mx-0" placeholder="Event type" value={formState.EventType} name="EventType"
                          onChange={handleChange}/>
            <Form.Text className="mx-0">Description</Form.Text>
            <Form.Control className="mx-0" as="textarea" value={formState.EventDesc} name="EventDesc"
                          onChange={handleChange}/>
            <Form.Text className="mx-0">Restrictions</Form.Text>
            <Form.Control className="mx-0" placeholder="Event restrictions" value={formState.EventRestrictions}
                          name="EventRestrictions" onChange={handleChange}/>
            <Form.Text className="mx-0">Age Limit</Form.Text>
            <Form.Control className="mx-0" type="number" value={formState.EventAgeLimit} name="EventAgeLimit"
                          onChange={handleChange} min={1}/>
            <Form.Text className="mx-0">Location</Form.Text>
            <Form.Control className="mx-0" value={formState.Location} name="Location" onChange={handleChange}/>
            <Form.Text className="mx-0">Capacity</Form.Text>
            <Form.Control className="mx-0" type="number" value={formState.Capacity} name="Capacity"
                          onChange={handleChange} min={1}/>
            <Form.Text className="mx-0">Time</Form.Text>
            <InputGroup>
                <Form.Control className="mx-0" type="time" value={formState.startTime} name="startTime"
                              onChange={handleChange}/>
                <Form.Control className="mx-0" type="time" value={formState.endTime} name="endTime"
                              onChange={handleChange}/>
            </InputGroup>
        </Form>
    );
}