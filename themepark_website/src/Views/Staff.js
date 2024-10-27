import React, {useState, useRef, useEffect, useMemo, useContext, createContext} from "react";
import { Accordion, Button, Container, ListGroup, Offcanvas, Modal, Spinner, Form, FloatingLabel, InputGroup } from "react-bootstrap";
import { apiGet, apiPost } from "../CRUDApi";

export function StaffList() {
    const [entries, setEntries] = useState([]);

    const getEmployees = async () => {
        const response = await apiGet("/employee/data/all/0")
        .catch((e) => console.log(e));
        if (response.code === 200) setEntries(response.body.data);
    }

    useEffect(() => {
        getEmployees().catch((e) => console.log(e));
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

const StaffManagerContext = createContext();

function StaffManagerContextProvider({children}) {
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
    const {setCanSubmit, setFormData} = useContext(StaffManagerContext);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dob, setDob] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        if (firstName && lastName && email && password && dob && phone && address && startDate && endDate) {
            setCanSubmit(true);
            setFormData(
                {
                    firstName: firstName,
                    lastName: lastName,
                    username: email,
                    password: password,
                    dob: dob,
                    phoneNumber: phone,
                    address: address,
                    startDate: startDate,
                    endDate: endDate
                }
            );
        }
        else {
            setCanSubmit(false);
            setFormData(null);
        }
    }, [firstName, lastName, email, password, dob, phone, address, startDate, endDate])

    return (
        <Form>
            <Form.Text className="mx-1">Name</Form.Text>
            <InputGroup className="mb-1">
                <Form.Control placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)}/>
                <Form.Control placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)}/>
            </InputGroup>
            <Form.Text className="mx-1">Email</Form.Text>
            <Form.Control type="email" placeholder="Email address" className="mb-1" value={email} onChange={e => setEmail(e.target.value)}/>
            <Form.Text className="mx-1">Password</Form.Text>
            <Form.Control type="password" placeholder="Password" className="mb-1" value={password} onChange={e => setPassword(e.target.value)}/>
            <Form.Text className="mx-1">Date of birth</Form.Text>
            <Form.Control type="date" className="mb-1" value={dob} onChange={e => setDob(e.target.value)}/>
            <Form.Text className="mx-1">Phone</Form.Text>
            <Form.Control className="mb-1" placeholder="123-456-7890" value={phone} onChange={e => setPhone(e.target.value)}/>
            <Form.Text className="mx-1">Address</Form.Text>
            <Form.Control className="mb-1" placeholder="Street, Apt#, City, State, Zip" value={address} onChange={e => setAddress(e.target.value)}/>
            <Form.Text className="mx-1">Start date</Form.Text>
            <Form.Control type="date" className="mb-1" value={startDate} onChange={e => setStartDate(e.target.value)}/>
            <Form.Text className="mx-1">End date</Form.Text>
            <Form.Control type="date" className="mb-1" value={endDate} onChange={e => setEndDate(e.target.value)}/>
        </Form>
    );
}

function EmployeeModalFormContainer() {
    const {canSubmit, formData, showForm, setShowForm} = useContext(StaffManagerContext);
    const [inProgress, setInProgress] = useState(false);
    const [submitEnabled, setSubmitEnabled] = useState(true);
    const [failed, setFailed] = useState(false);

    const handleSubmit = () => {
        const submitData = async () => {
            const response = await apiPost("/employee/register", formData)
            .catch((e) => console.log(e));
            if (!response || response.code !== 200) {
                setFailed(true);
                setSubmitEnabled(false);
                setInProgress(false);
            } else setShowForm(false);
        }
        setInProgress(true);
        submitData().catch((e) => console.log(e));
    }

    // Reset form state on close events
    useEffect(() => {
        if (showForm) {
            setFailed(false);
            setInProgress(false);
            setSubmitEnabled(true);
        }
    }, [showForm])

    return (
        <Modal
            show={showForm}
            onHide={() => setShowForm(false)}
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