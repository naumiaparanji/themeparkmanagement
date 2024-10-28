import React, { useEffect, useState, } from "react";
import axios from 'axios';
import './DataManage.css';
import 'bootstrap/dist/css/bootstrap.min.css'

function DataManage() {
    const [data, setData] = useState([])

    useEffect(()=> {
    axios.get('http://localhost:3001/users')
        .then(res => setData(res.data))
        .catch(err => console.log(err));
  }, [])

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light vh-100">
        <h1>List of Users</h1>
    <div className="InformationTable">
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
    </div>
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
*/