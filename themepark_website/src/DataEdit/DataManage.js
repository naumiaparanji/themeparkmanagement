import React, { useEffect, useState, useContext } from "react";
import axios from 'axios';
import './DataManage.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { EmployeeModalFormContainer, StaffManagerContext } from "../Views/Staff";
// ^^^ This will be reworked to no longer need StaffManagerContext

function DataManage() {
// Supposed to grab Data from the Database
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
    <div className="d-flex flex-column align-items-center bg-light vh-100">
        <h1 className="h01">User Management</h1>
    <div className="InformationTable">
        <form>
            <input type="number" name="EmployeeID" placeholder="EmployeeID" required onChange={setInput}></input>
            <input name="FirstName" placeholder="First Name" onChange={setInput}></input>
            <input name="LastName" placeholder="Last Name" onChange={setInput}></input>
            <input type="tel" name="PhoneNumber" placeholder="Phone Number" maxLength="10" onChange={setInput}></input>
            <input name="Email" placeholder="Email" onChange={setInput}></input>
        </form>
        <p>
            <button className="buttons-mod" onClick={() => fetchData()}>Modify</button>
            <button className="buttons-mod" onClick={() => setShowForm(true)}>Create</button>
            <button className="buttons-mod-del" onClick={() => fetchData()}>Delete</button>
        </p>
        <p>EmployeeID: {returnedData.EmployeeID}</p>
        <p>First Name: {returnedData.FirstName}</p>
        <p>Last name: {returnedData.LastName}</p>
        <p>Phone Number: {returnedData.PhoneNumber}</p>
        <p>Email: {returnedData.Email}</p>
        {returnedData}
    </div>
    <EmployeeModalFormContainer/> 
    </div>
  )
}

export default DataManage;

/*   
function DataManage() {
  const [name, setName] = useState("");

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light vh-100">
        <h1>List of Users</h1>

<form>
<label>
<input text="text"
  type="text" 
  value={name}
  placeholder="EmployeeName"
  onChange={(e) => setName(e.target.value)}
/>
</label>
</form>
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DataManage />);

================================================================================
    const [data, setData] = useState([])

    useEffect(()=> {
    axios.get('http://localhost:3001/users')
        .then(res => setData(res.data))
        .catch(err => console.log(err));
  }, [])



        <table className='table table-stipend'>
            <thread>
                <tr>
                    <th>ID</th>
                    <th>FirstName</th>
                    <th>LastName</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Action</th>
                </tr>
            </thread>
            <tbody>
                {
                    data.map((d, i) => {
                        <tr key={i}>
                            <td>{d.id}</td>
                            <td>{d.firstname}</td>
                            <td>{d.lastname}</td>
                            <td>{d.email}</td>
                            <td>{d.phone}</td>
                            <td>
                                <button className="btn btn-sm btn-primary me-2">Edit</button>
                                <button className="btn btn-sm btn-danger">Delete</button>
                            </td>
                        </tr>
                    })
                }
            </tbody>
        </table>
*/