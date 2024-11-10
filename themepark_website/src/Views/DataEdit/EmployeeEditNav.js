import { useContext, useState, useCallback, useEffect } from "react";
import { Navbar, Container, Form, InputGroup, Button } from "react-bootstrap";
import { EmployeeModalFormContainer, StaffManagerContext } from "../Staff";
import { api } from "../../App";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DataManage.css';

export function EmployeeEditNav() {
    const {search, setSearch} = useContext(StaffManagerContext);
    const [createState, setCreateState] = useState(false);

    const handleHide = useCallback(() => setCreateState(false), []);
    const handleAddEvent = useCallback(() => setCreateState(true), []);

    const {setShowForm} = useContext(StaffManagerContext);
    const [returnedData, setReturnedData] = useState(['hello']); 
    const [employee, SetEmployee] = useState({EmployeeID: 0, FirstName: '', LastName: '', Age: 0, Gender: ''})

    const setInput = (e) => {
        const {name, value} = e.target;
        console.log(value);
        if (name === 'EmployeeID' || name === 'Age') {
            SetEmployee(prevState => ({
                ...prevState,
                [name]: parseInt(value)
            }));
            return;
        }
        SetEmployee(prevState => ({
            ...prevState,
            [name]: parseInt(value)
        }));
    }

    const [data, setData] = useState([])

    useEffect(()=> {
    axios.get('http://localhost:8080')
        .then(res => setData(res.data))
        .catch(err => console.log(err));
  }, [])

    const fetchData = async () => {
        console.log(employee);
        const newData = await fetch('/api', {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        console.log(newData);
        setReturnedData(newData.result)
    }

    return (
        <>
        <Navbar fixed="top">
            <Container fluid>
                <Form className="w-100">
                    <InputGroup className="d-flex">
                        <Form.Control placeholder="Search" className="m-0" value={search} />
                        <Button onClick={() => setShowForm(true)} className="Create">Add User</Button>
                    </InputGroup>
                </Form>
            </Container>
        </Navbar>
        <EmployeeModalFormContainer/> 
        <hr/>
        </>
    );
}