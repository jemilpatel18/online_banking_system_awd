import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function Deposit() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user || user.role !== 'user') navigate('/login');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('/api/deposit', {
        userId: user._id,
        amount: Number(amount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage(`Successfully deposited ₹${amount}. New balance: ₹${response.data.balance}`);
      
      // Update user in local storage
      const updatedUser = { ...user, balance: response.data.balance };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setAmount('');
    } catch (err) {
      setError(err.response?.data?.message || 'Deposit failed');
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar role="user" />
      <div className="main-content">
        <h2>Deposit Money</h2>
        <div className="card form-container">
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input 
                type="number" 
                min="1" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary">Deposit</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Deposit;
