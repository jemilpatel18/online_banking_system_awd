import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function ManageFDs() {
  const [fds, setFds] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchFds();
  }, [currentUser, navigate]);

  const fetchFds = async () => {
    try {
      const response = await axios.get('/api/fd', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFds(response.data);
    } catch (err) {
      console.error('Error fetching FDs', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this FD?')) {
      try {
        await axios.delete(`/api/fd/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('FD deleted successfully');
        fetchFds();
      } catch (err) {
        console.error('Error deleting FD', err);
      }
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar role="admin" />
      <div className="main-content">
        <h2>Manage Fixed Deposits</h2>
        {message && <div className="alert alert-success">{message}</div>}
        
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Rate</th>
                  <th>Duration</th>
                  <th>Interest</th>
                  <th>Maturity Amt</th>
                  <th>Maturity Date</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fds.map(fd => (
                  <tr key={fd._id}>
                    <td>{fd.user?.fullName || fd.user?.email || 'N/A'}</td>
                    <td>₹{fd.amount}</td>
                    <td>{fd.interestRate}%</td>
                    <td>{fd.duration} Yrs</td>
                    <td>₹{fd.interest}</td>
                    <td>₹{fd.maturityAmount}</td>
                    <td>{fd.maturityDate ? new Date(fd.maturityDate).toLocaleDateString() : '-'}</td>
                    <td>{fd.status || 'Active'}</td>
                    <td>{new Date(fd.createdAt || fd.date).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(fd._id)}
                        className="btn btn-danger"
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageFDs;
