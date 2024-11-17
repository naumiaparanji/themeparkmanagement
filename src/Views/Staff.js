import React, {useState, useRef, useEffect, useMemo, useContext, createContext} from "react";
import { Accordion, Button, Container, ListGroup, Offcanvas, Modal, Spinner, Form, FloatingLabel, InputGroup } from "react-bootstrap";
import { ApiContext } from "../ApiContext";
import { api } from "../App";

export function StaffList() {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        /*
        const getEmployees = async () => {
            const response = await apiGet("/employee/data/all/0")
            .catch((e) => console.log(e));
            if (response.code === 200) setEntries(response.body.data);
        }
        getEmployees().catch((e) => console.log(e));
        axios.get("/employee/data/all/0")
        .catch(error => {

        }).then(res => {
            setEntries(res.data.data);
        }); */
    }, [])

    return (
        <Accordion defaultActiveKey="0">
            {entries.map((entry, i) => (
                <Accordion.Item eventKey={i} className="p-0">
                    <Accordion.Header>
                        {entry.email}
                    </Accordion.Header>
                    <Accordion.Body>
                            qqqq
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    )
}

export const StaffManagerContext = createContext();

export function StaffManagerContextProvider({children}) {
    const [canSubmit, setCanSubmit] = useState(false);
    const [formData, setFormData] = useState(null);
    const [showForm, setShowForm] = useState(false);

    return (
        <StaffManagerContext.Provider value={
            {
                canSubmit, setCanSubmit, 
                formData, setFormData,
                showForm, setShowForm,
            }
            }>
            {children}
        </StaffManagerContext.Provider>
    );
}

export function EmployeeForm() {
    const {data} = useContext(ApiContext);
    const {setCanSubmit, setFormData} = useContext(StaffManagerContext);
    const [formState, setFormState] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        dob: "",
        phoneNumber: "",
        address: "",
        startDate: "",
        endDate: "",
        accessLevel: data.canModify? data.canModify[0].value : null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        const isFormComplete = Object.values(formState).every((field) => field);
        setCanSubmit(isFormComplete);
        setFormData(isFormComplete ? formState : null);
    }, [formState, setCanSubmit, setFormData]);

    return (
        <Form>
            <Form.Text className="mx-1">Name</Form.Text>
            <InputGroup className="mb-1">
                <Form.Control placeholder="First name" value={formState.firstName} name="firstName" onChange={handleChange}/>
                <Form.Control placeholder="Last name" value={formState.lastName} name="lastName" onChange={handleChange}/>
            </InputGroup>
            <Form.Text className="mx-1">Email</Form.Text>
            <Form.Control type="email" placeholder="Email address" className="mb-1" value={formState.email} name="email" onChange={handleChange}/>
            <Form.Text className="mx-1">Password</Form.Text>
            <Form.Control type="password" placeholder="Password" className="mb-1" value={formState.password} name="password" onChange={handleChange}/>
            <Form.Text className="mx-1">Date of birth</Form.Text>
            <Form.Control type="date" className="mb-1" value={formState.dob} name="dob" onChange={handleChange}/>
            <Form.Text className="mx-1">Phone</Form.Text>
            <Form.Control className="mb-1" placeholder="123-456-7890" value={formState.phoneNumber} name="phoneNumber" onChange={handleChange}/>
            <Form.Text className="mx-1">Address</Form.Text>
            <Form.Control className="mb-1" placeholder="Street, Apt#, City, State, Zip" value={formState.address} name="address" onChange={handleChange}/>
            <Form.Text className="mx-1">Start date</Form.Text>
            <Form.Control type="date" className="mb-1" value={formState.startDate} name="startDate" onChange={handleChange}/>
            <Form.Text className="mx-1">End date</Form.Text>
            <Form.Control type="date" className="mb-1" value={formState.endDate} name="endDate" onChange={handleChange}/>
            <Form.Text className="mx-1">Role</Form.Text>
            <Form.Select aria-label="Employee Role" value={formState.accessLevel} name="accessLevel" onChange={handleChange}>
                {data.canModify? data.canModify.map((entry, i) => (
                    <option key={i} value={entry.value}>{entry.name}</option>
                )) : null}
            </Form.Select>
        </Form>
    );
}

export function EmployeeModalFormContainer() {
    const {canSubmit, formData, showForm, setShowForm, setFormData} = useContext(StaffManagerContext);
    const [inProgress, setInProgress] = useState(false);
    const [submitEnabled, setSubmitEnabled] = useState(true);
    const [failed, setFailed] = useState(false);

    const handleSubmit = () => {
        setInProgress(true);
        api.post("/employee/register", formData)
        .then(() => {
            setShowForm(false);
        })
        .catch((e) => {
            console.error(e);
            setFailed(true);
            setSubmitEnabled(false);
            setInProgress(false);
        });
    }

    const handleOnShow = () => {
        setFormData(null);
        setFailed(false);
        setInProgress(false);
        setSubmitEnabled(true);
    }

    return (
        <Modal
            show={showForm}
            onHide={() => setShowForm(false)}
            onShow={handleOnShow}
            backdrop="static"
            keyboard={false}
            fullscreen={false}
        >
            <Modal.Header closeButton>
                <Offcanvas.Title>Register Employee</Offcanvas.Title>
            </Modal.Header>
            <Modal.Body>
                <EmployeeForm/>
            </Modal.Body>
            <Modal.Footer>
                <Button disabled={!(canSubmit && submitEnabled)} onClick={handleSubmit} variant={failed? "danger" : "primary"}>
                    {inProgress? 
                    (<Spinner
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />) : failed? "Failed" : "Save"
                    }
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

function StaffManager() {
    const {setShowForm} = useContext(StaffManagerContext);

    return (
        <div>
            <Button variant="primary" onClick={() => setShowForm(true)}>
            Launch static backdrop modal
            </Button>
            <EmployeeModalFormContainer/> 
        </div>
    );
}

export function StaffView() {
    return (
        <StaffManagerContextProvider>
            <StaffManager/>
        </StaffManagerContextProvider>
    );
}