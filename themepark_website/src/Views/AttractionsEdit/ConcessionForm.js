import { useContext, useEffect, useCallback, useState } from "react";
import { AccordionContext, Form, InputGroup } from "react-bootstrap";
import { ItemEditContext } from "./ItemEditContext";

const defaultState = {
    ConcessionID: -1,
    OpensAt: "00:00:00",
    OpenInput: "09:00", // FOR INPUT ONLY
    CloseInput: "20:00", // FOR INPUT ONLY
    OpenDuration: "60",
    Location: "",
    Deleted: 0,
    CName: "",
    CDesc: "",
    CPriceMin: 1,
    CPriceMax: 1,
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


export function ConcessionForm() {
    const { activeEventKey } = useContext(AccordionContext);
    const { item, eventKey, setEditState } = useContext(ItemEditContext);
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
        newState.CPriceMin = parseInt(newState.CPriceMin);
        newState.CPriceMax = parseInt(newState.CPriceMax);
        if (isNaN(newState.CPriceMin)) newState.CPriceMin = formState.CPriceMin;
        if (isNaN(newState.CPriceMax)) newState.CPriceMax = formState.CPriceMax;
        newState.CPriceMin = Math.min(Math.max(1, newState.CPriceMin), 10000);
        newState.CPriceMax = Math.min(Math.max(1, newState.CPriceMax), 10000);
        if (newState.CPriceMin > newState.CPriceMax) {
            if (name === "CPriceMin")
                newState.CPriceMax = newState.CPriceMin;
            else
                newState.CPriceMin = newState.CPriceMax;
        }
        if (name === "OpenInput" || name === "CloseInput") {
            inputFieldsToTime(newState);
        }
        setFormState(newState);
        setEditState(newState);
    }, [setEditState, formState]);

    return (
        <>
            {item && formState && (
                <Form>
                    <Form.Text className="mx-0">Name</Form.Text>
                    <Form.Control className="mx-0" placeholder="Concession stand name" value={formState.CName} name="CName" onChange={handleChange}/>
                    <Form.Text className="mx-0">Description</Form.Text>
                    <Form.Control className="mx-0" value={formState.CDesc} name="CDesc" onChange={handleChange}/>
                    <Form.Text className="mx-0">Location</Form.Text>
                    <Form.Control className="mx-0" value={formState.Location} name="Location" onChange={handleChange}/>
                    <Form.Text className="mx-0">Operating Hours</Form.Text>
                    <InputGroup>
                        <Form.Control className="mx-0" type="time" value={formState.OpenInput} name="OpenInput" onChange={handleChange}/>
                        <Form.Control className="mx-0" type="time" value={formState.CloseInput} name="CloseInput" onChange={handleChange}/>
                    </InputGroup>
                    <Form.Text className="mx-0">Price Range</Form.Text>
                    <InputGroup>
                        <Form.Control className="mx-0" type="number" value={formState.CPriceMin} name="CPriceMin" onChange={handleChange} />
                        <Form.Control className="mx-0" type="number" value={formState.CPriceMax} name="CPriceMax" onChange={handleChange} />
                    </InputGroup>
                </Form>
            )}
        </>
    );
}