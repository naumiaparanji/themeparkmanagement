import {useCallback, useContext, useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import {Container, Form, InputGroup, Navbar} from "react-bootstrap";
import {EmployeeModalFormContainer, StaffManagerContext} from "./Staff";
import {api} from "../../App";
import 'bootstrap/dist/css/bootstrap.min.css';
import './DataManage.css';

export function CustomerEditNav() {
    const [search, setSearch] = useState('');
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

    useEffect(() => {
        api.get('/customer/data/info')
            .then(res => setData(res.data))
            .catch(err => console.log(err));
    }, [])

    const filteredData = data.filter((d) => {
        return Object.values(d).some((value) =>
            typeof value === 'string' || typeof value === 'number' // Ensure valid type
                ? value.toString().toLowerCase().includes(search.toLowerCase())
                : false
        );
    });

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
                            <Form.Control placeholder="Search" className="m-0" value={search} onChange={(e) => setSearch(e.target.value)}/>
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
                    {filteredData.length > 0 ? (
                        filteredData.map((d, i) => (
                            <tr key={i}>
                                <td>{d.CustomerID}</td>
                                <td>{d.FirstName}</td>
                                <td>{d.LastName}</td>
                                <td>{d.DOB}</td>
                                <td>{d.Address}</td>
                                <td>{d.Email}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => alert (
                                    "The 'Customer Edit' function is currently unavailable. Please contact the Database Administrator for further assistance.")}>
                                    Edit
                                    </button>
                                    <button onClick={e => {
                                        handleDelete(d.CustomerID);
                                        window.location.reload();
                                    }} className="btn btn-sm btn-danger">Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">
                                No matching records found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            <EmployeeModalFormContainer/>
            <hr/>
        </>
    );
}