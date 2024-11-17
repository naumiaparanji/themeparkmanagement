import { useContext, useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Navbar, Container, Form, InputGroup, Button } from "react-bootstrap";
import { EmployeeModalFormContainer, StaffManagerContext } from "../Staff";
import { api } from "../../App";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DataManage.css';

export function CustomerEditNav() {
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
    const navigate = useNavigate();

    useEffect(()=> {
    api.get('/customer/data/info')
        .then(res => setData(res.data))
        .catch(err => console.log(err));
  }, [])


  const handleDelete = (CustomerID) => {
    const confirm = window.confirm("Would you like to Delete?");
    if (confirm) {
        api.delete(`/customer/data/${CustomerID}`)
            .then(() => {
                alert("Customer deleted successfully.");
                navigate('/employee/access/datamanage');
            })
            .catch((err) => console.log(err));
    }
};

    return (
        <>
        <Navbar>
            <Container fluid>
                <Form className="w-100">
                    <InputGroup className="d-flex">
                        <Form.Control placeholder="Search" className="m-0" value={search} />
                    </InputGroup>
                </Form>
            </Container>
        </Navbar>
                    <div className='d-flex flex-column align-items-center bg-white p-1'>
                    <table>
                            <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>FirstName</th>
                                        <th>LastName</th>
                                        <th>DOB</th>
                                        <th>Address</th>
                                        <th>Email</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((d, i) => (
                                            <tr key={i}>
                                                <td>{d.CustomerID}</td>
                                                <td>{d.FirstName}</td>
                                                <td>{d.LastName}</td>
                                                <td>{d.DOB}</td>
                                                <td>{d.Address}</td>
                                                <td>{d.Email}</td>
                                                <td>  
                                                    <button className="btn btn-sm btn-primary me-2">Edit</button>
                                                    <button onClick={e => {handleDelete(d.CustomerID); window.location.reload();}} className="btn btn-sm btn-danger">Delete</button>
                                                </td>
                                            </tr>
                                    ))}
                            
                        </tbody>
                    </table>
                    </div>
        <EmployeeModalFormContainer/> 
        <hr/>
        </>
    );
}