import React from 'react'
import { api } from "../../App";
import { Link, useParams } from 'react-router-dom';

function Read() {
    const [data, setData] = useState([])
    const {EmployeeID} = useParams();

    useEffect(()=> {
    api.get('/employee/data/info')
        .then(res => setData(res.data))
        .catch(err => console.log(err));
    }, [])

 /*   return (
        <div className='d-flex w-100 vh-100 justify-content-center align-items-center bg-light'>
            <div className='w-50 border bg-white shadow px-5 pt-3 pb-5 rounded'>
                <h3>Details of User</h3>
                <div className='mb-2'>
                    <strong>EmployeeID: {data.EmployeeID}</strong>
                </div>
                <div className='mb-2'>
                    <strong>FirstName: {data.FirstName}</strong>
                </div>
                <div className='mb-2'>
                    <strong>LastName: {data.LastName}</strong>
                </div>
                <div className='mb-2'>
                    <strong>DOB: {data.DOB}</strong>
                </div>
                <div className='mb-2'>
                    <strong>Address: {data.Address}</strong>
                </div>
                <div className='mb-2'>
                    <strong>Phone Number: {data.PhoneNumber}</strong>
                </div>
                <div className='mb-2'>
                    <strong>Email: {data.Email}</strong>
                </div>
                <div className='mb-2'>
                    <strong>Password: {data.Password}</strong>
                </div>
                <div className='mb-2'>
                    <strong>AccessLevel: {data.AccessLevel}</strong>
                </div>
                <div className='mb-2'>
                    <strong>StartDate: {data.StartDate}</strong>
                </div>
                <div className='mb-2'>
                    <strong>EndDate: {data.EndDate}</strong>
                </div>
                <div className='mb-2'>
                    <strong>Deleted: {data.Deleted}</strong>
                </div>
                <Link to={`/update/${EmployeeID}`} className='btn btn-success'>Edit</Link>
                <Link to="./EmployeeEditNav" className='btn btn-primary ms-3'>Back</Link>
            </div>

        </div>
    )
*/
    }


export default Read();