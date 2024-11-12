import { useState, useContext, useEffect, useCallback } from "react";
import { AccordionContext, Form, InputGroup } from "react-bootstrap";

const defaultState = {
    RestaurantID: -1,
    OpensAt: "00:00:00",
    OpenInput: "09:00", // FOR INPUT ONLY
    CloseInput: "20:00", // FOR INPUT ONLY
    OpenDuration: "60",
    Location: "",
    Deleted: 0,
    RName: "",
    RDesc: "",
    RPriceMin: 1,
    RPriceMax: 1,
    SeatingCapacity: 1
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


export function RestaurantForm({item, eventKey, onChange}) {
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
        newState.RPriceMin = parseInt(newState.RPriceMin);
        newState.RPriceMax = parseInt(newState.RPriceMax);
        newState.SeatingCapacity = parseInt(newState.SeatingCapacity);
        if (isNaN(newState.RPriceMin)) newState.RPriceMin = formState.RPriceMin;
        if (isNaN(newState.RPriceMax)) newState.RPriceMax = formState.RPriceMax;
        if (isNaN(newState.SeatingCapacity)) newState.SeatingCapacity = formState.SeatingCapacity;
        newState.RPriceMin = Math.min(Math.max(1, newState.RPriceMin), 10000);
        newState.RPriceMax = Math.min(Math.max(1, newState.RPriceMax), 10000);
        newState.SeatingCapacity = Math.min(Math.max(1, newState.SeatingCapacity), 200);
        if (newState.RPriceMin > newState.RPriceMax) {
            if (name === "RPriceMin")
                newState.RPriceMax = newState.RPriceMin;
            else
                newState.RPriceMin = newState.RPriceMax;
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
                    <Form.Control className="mx-0" placeholder="Concession stand name" value={formState.RName} name="RName" onChange={handleChange}/>
                    <Form.Text className="mx-0">Description</Form.Text>
                    <Form.Control className="mx-0" value={formState.RDesc} name="RDesc" onChange={handleChange}/>
                    <Form.Text className="mx-0">Location</Form.Text>
                    <Form.Control className="mx-0" value={formState.Location} name="Location" onChange={handleChange}/>
                    <Form.Text className="mx-0">Seating Capacity</Form.Text>
                    <Form.Control className="mx-0" value={formState.SeatingCapacity} name="SeatingCapacity" onChange={handleChange}/>
                    <Form.Text className="mx-0">Operating Hours</Form.Text>
                    <InputGroup>
                        <Form.Control className="mx-0" type="time" value={formState.OpenInput} name="OpenInput" onChange={handleChange}/>
                        <Form.Control className="mx-0" type="time" value={formState.CloseInput} name="CloseInput" onChange={handleChange}/>
                    </InputGroup>
                    <Form.Text className="mx-0">Price Range</Form.Text>
                    <InputGroup>
                        <Form.Control className="mx-0" type="number" value={formState.RPriceMin} name="RPriceMin" onChange={handleChange} />
                        <Form.Control className="mx-0" type="number" value={formState.RPriceMax} name="RPriceMax" onChange={handleChange} />
                    </InputGroup>
                </Form>
            )}
        </>
    );
}