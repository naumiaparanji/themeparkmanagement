import React, { useState, useEffect } from 'react';
import { api } from "../../App";
import { useParams } from 'react-router-dom';

const EmployeeMod = ({ EmployeeID }) => {
  const [employee, setEmployee] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [firstname, setFirstName] = useState();
  const [lastname, setLastName] = useState();
  const [email, setEmail] = useState();

  // Fetch employee details
  useEffect(() => {
    api.get('/employee/edit/'+id)
      .then(res => {
        setFirstName(res.data[0].FirstName);
        setLastName(res.data[0].LastName);
        setEmail(res.data[0].Email)
      })
      .catch(err => console.log(err));
  }, [])

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    api.put('/employee/update/'+id, {firstname, lastname, email})
    .then(res => {
      if(res.data.updated) {
        navigate('/EmployeeEditNav')
      } else {
        alert("Employee Not Updated")
      }
    })
  }

  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded p-3'>
        <form onSubmit={handleSubmit}>
          <h2>Update Employee</h2>
          <div className='mb-2'>
            <label htmlFor="">FirstName</label>
            <input type="text" placeholder="Enter First Name" className='form-control' value={firstname} onChange={e => setFirstName(e.target.value)} />
          </div>
          <div className='mb-2'>
            <label htmlFor="">LastName</label>
            <input type="text" placeholder="Enter Last Name" className='form-control' value={lastname} onChange={e => setLastName(e.target.value)} />
          </div>
          <div className='mb-2'>
            <label htmlFor="">Email</label>
            <input type="text" placeholder="Enter Email" className='form-control' value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeMod;

/*
const EditEmployee = ({ EmployeeID }) => {
  const [employee, setEmployee] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [name, setName] = useState();
  const [email, setEmail] = useState();

  // Fetch employee details
  useEffect(() => {
    api.get('/employee/edit/'+id)
      .then(res => {
        setName(res.data[0].Name);
        setEmail(res.data[0].Email)
      })
      .catch(err => console.log(err));
  }, [])

  // Handle input changes
  const handleChange = (e) => {
    const { name: FirstName, value } = e.target;
    setEmployee((prev) => ({ ...prev, [FirstName]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.put(`/employee/mod/${EmployeeID}`, {
        name: employee.name,
        email: employee.email
      });
      console.log(response.data);
      alert('Employee updated successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to update employee.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Edit Employee</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={employee.FirstName} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={employee.Email} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}; */