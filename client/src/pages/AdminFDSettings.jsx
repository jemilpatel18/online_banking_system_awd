import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function AdminFDSettings() {
  const [rate, setRate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchRate = async () => {
      try {
        const response = await api.get('/api/fd-rate');
        setRate(response.data.fdInterestRate ?? 15);
      } catch (err) {
        console.error('Error fetching FD rate', err);
      }
    };

    fetchRate();
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const numericRate = Number(rate);
    if (!Number.isFinite(numericRate) || numericRate < 0) {
      setError('Please enter a valid FD interest rate.');
      return;
    }

    try {
      await api.put('/api/fd-rate', { fdInterestRate: numericRate });
      setRate(numericRate);
      setMessage('Fixed Deposit rate updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating rate.');
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar role="admin" />
      <div className="main-content">
        <h2>FD Rate Settings</h2>
        <div className="card form-container" style={{ margin: '0' }}>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Current FD Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Update Rate</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AdminFDSettings;
