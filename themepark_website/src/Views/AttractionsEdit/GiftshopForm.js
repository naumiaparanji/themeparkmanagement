import { useState, useContext, useEffect, useCallback } from "react";
import { AccordionContext, Form, InputGroup } from "react-bootstrap";

const defaultState = {
    GiftshopID: -1,
    OpensAt: "00:00:00",
    OpenInput: "12:00 am", // FOR INPUT ONLY
    CloseInput: "12:00 pm", // FOR INPUT ONLY
    OpenDuration: "60",
    Location: "",
    Deleted: 0,
    GName: "",
    GDesc: "",
    GPriceMin: 1,
    GPriceMax: 1,
}

function timeFieldsToInput(item) {
    let output = {...item};
    const [openHours, openMinutes] = item.OpensAt.split(":").map(Number);
    output.OpenInput = `${String(openHours).padStart(2, "0")}:${String(openMinutes).padStart(2, "0")}`;
    const totalMinutes = openHours * 60 + openMinutes + item.OpenDuration;
    const closeHours = Math.floor(totalMinutes / 60) % 24;
    const closeMinutes = totalMinutes % 60;
    output.CloseInput = `${String(closeHours).padStart(2, "0")}:${String(closeMinutes).padStart(2, "0")}`;
    return output;
}

function inputFieldsToTime(item) {
    const [openHours, openMinutes] = item.OpenInput.split(":").map(Number);
    const [closeHours, closeMinutes] = item.CloseInput.split(":").map(Number);
    item.OpensAt = `${String(openHours).padStart(2, "0")}:${String(openMinutes).padStart(2, "0")}:00`;
    const openTotalMinutes = openHours * 60 + openMinutes;
    const closeTotalMinutes = closeHours * 60 + closeMinutes;
    item.OpenDuration = (closeTotalMinutes >= openTotalMinutes)
        ? closeTotalMinutes - openTotalMinutes
        : 1440 - openTotalMinutes + closeTotalMinutes;
}


export function GiftshopForm({item, eventKey, onChange}) {
    const { activeEventKey } = useContext(AccordionContext);
    const [ formState, setFormState ] = useState(defaultState);

    useEffect(() => {
        if (activeEventKey === eventKey) {
            setFormState(timeFieldsToInput({...defaultState, ...item}));
        }
    }, [activeEventKey, eventKey, item]);

    const handleChange = useCallback((e) => {
        let { name, value } = e.target;
        let newState = {
            ...formState,
            [name]: value
        };
        newState.GPriceMin = parseInt(newState.GPriceMin);
        newState.GPriceMax = parseInt(newState.GPriceMax);
        if (isNaN(newState.GPriceMin)) newState.GPriceMin = formState.GPriceMin;
        if (isNaN(newState.GPriceMax)) newState.GPriceMax = formState.GPriceMax;
        newState.GPriceMin = Math.min(Math.max(1, newState.GPriceMin), 10000);
        newState.GPriceMax = Math.min(Math.max(1, newState.GPriceMax), 10000);
        if (newState.GPriceMin > newState.GPriceMax) {
            if (name === "GPriceMin")
                newState.GPriceMax = newState.GPriceMin;
            else
                newState.GPriceMin = newState.GPriceMax;
        }
        if (name === "OpenInput" || name === "CloseInput") {
            inputFieldsToTime(newState);
        }
        setFormState(newState);
        onChange && onChange(newState);
    }, [setFormState, formState, onChange]);

    return (
        <>
            {item && (
                <Form>
                    <Form.Text className="mx-0">Name</Form.Text>
                    <Form.Control className="mx-0" placeholder="Concession stand name" value={formState.GName} name="GName" onChange={handleChange}/>
                    <Form.Text className="mx-0">Description</Form.Text>
                    <Form.Control className="mx-0" value={formState.GDesc} name="GDesc" onChange={handleChange}/>
                    <Form.Text className="mx-0">Location</Form.Text>
                    <Form.Control className="mx-0" value={formState.Location} name="Location" onChange={handleChange}/>
                    <Form.Text className="mx-0">Operating Hours</Form.Text>
                    <InputGroup>
                        <Form.Control className="mx-0" type="time" value={formState.OpenInput} name="OpenInput" onChange={handleChange}/>
                        <Form.Control className="mx-0" type="time" value={formState.CloseInput} name="CloseInput" onChange={handleChange}/>
                    </InputGroup>
                    <Form.Text className="mx-0">Price Range</Form.Text>
                    <InputGroup>
                        <Form.Control className="mx-0" type="number" value={formState.GPriceMin} name="GPriceMin" onChange={handleChange} />
                        <Form.Control className="mx-0" type="number" value={formState.GPriceMax} name="GPriceMax" onChange={handleChange} />
                    </InputGroup>
                </Form>
            )}
        </>
    );
}