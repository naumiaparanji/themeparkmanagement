import {useCallback, useContext, useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import {Button, Container, Form, InputGroup, Navbar} from "react-bootstrap";
import {EmployeeModalFormContainer, StaffManagerContext} from "./Staff";
import {api} from "../../App";
import 'bootstrap/dist/css/bootstrap.min.css';
import './DataManage.css';

export function EmployeeEditNav() {
    const [createState, setCreateState] = useState(false);
    const [search, setSearch] = useState('');

    const handleHide = useCallback(() => setCreateState(false), []);
    const handleAddEvent = useCallback(() => setCreateState(true), []);

    const {setShowForm} = useContext(StaffManagerContext);
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
        api.get('/employee/data/info')
            .then(res => setData(res.data))
            .catch(err => console.log(err));
    }, [])


    const handleDelete = (EmployeeID) => {
        const confirm = window.confirm("Would you like to Delete?");
        if (confirm) {
            api.delete(`/employee/data/${EmployeeID}`)
                .then(() => {
                    alert("Employee deleted successfully.");
                    navigate('/employee/access/datamanage');
                })
                .catch((err) => console.log(err));
        }
    };

    const filteredData = data.filter((d) => {
        return Object.values(d).some((value) =>
            typeof value === 'string' || typeof value === 'number' // Ensure valid type
                ? value.toString().toLowerCase().includes(search.toLowerCase())
                : false
        );
    });

    return (
        <>
            <Navbar>
                <Container fluid>
                    <Form className="w-100">
                        <InputGroup className="d-flex">
                            <Form.Control placeholder="Search" className="m-0" value={search} onChange={(e) => setSearch(e.target.value)}/>
                            <Button onClick={() => setShowForm(true)} className="Create">Add User</Button>
                        </InputGroup>
                    </Form>
                </Container>
            </Navbar>
            <div className='d-flex flex-column align-items-center bg-white p-1'>
                <table id="my-table">
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
                    {filteredData.length > 0 ? (
                        filteredData.map((d, i) => (
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
                                    <button
                                        onClick={() => handleDelete(d.EmployeeID)}
                                        className="btn btn-sm btn-danger"
                                    >
                                        Delete
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
        </>
    );
}

export default EmployeeEditNav