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
    axios.get('http://localhost:8080/employee/data/info')
        .then(res => setData(res.data))
        .catch(err => console.log(err));
  }, [])

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
        <div className="d-flex flex-column align-items-center vh-100">
                    <div className='rounded bg-white p-4'>
                    <table>
                            <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>FirstName</th>
                                        <th>LastName</th>
                                        <th>DOB</th>
                                        <th>Address</th>
                                        <th>PhoneNumber</th>
                                        <th>Email</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((d, i) => {
                                            <tr key={i}>
                                                <td>{d.EmployeeID}</td>
                                                <td>{d.FirstName}</td>
                                                <td>{d.LastName}</td>
                                                <td>{d.DOB}</td>
                                                <td>{d.Address}</td>
                                                <td>{d.PhoneNumber}</td>
                                                <td>{d.Email}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-primary me-2">Edit</button>
                                                    <button className="btn btn-sm btn-danger">Delete</button>
                                                </td>
                                            </tr>
                                    })}
                            
                        </tbody>
                    </table>
                    </div>
                    </div>
        <EmployeeModalFormContainer/> 
        <hr/>
        </>
    );
}