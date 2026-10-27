import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function FDSettings() {
  const [rate, setRate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchRate = async () => {
      try {
        const response = await axios.get('/api/fd-rate');
        const nextRate = response.data.fdInterestRate ?? 15;
        setRate(nextRate);
        localStorage.setItem('fdRate', String(nextRate));
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

    if (!token) {
      setError('Session expired. Please log in again.');
      navigate('/login');
      return;
    }

    try {
      const numericRate = Number(rate);
      if (!Number.isFinite(numericRate) || numericRate < 0) {
        setError('Please enter a valid FD interest rate.');
        return;
      }

      await axios.put('/api/fd-rate', { fdInterestRate: numericRate }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.setItem('fdRate', String(numericRate));
      setMessage('Fixed Deposit rate updated successfully!');
    } catch (err) {
      console.error('Error updating rate', err);
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

export default FDSettings;
