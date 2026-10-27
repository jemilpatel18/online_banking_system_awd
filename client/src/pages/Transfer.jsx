import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function Transfer() {
  const [receiverAccount, setReceiverAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
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
      const response = await axios.post('/api/transfer', {
        senderId: user._id,
        receiverAccount,
        amount: Number(amount),
        description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Transfer successful!');
      
      // Update user in local storage
      const updatedUser = { ...user, balance: response.data.balance };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setReceiverAccount('');
      setAmount('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed');
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar role="user" />
      <div className="main-content">
        <h2>Transfer Funds</h2>
        <div className="card form-container">
          <p>Current Balance: <strong>₹{user?.balance || 0}</strong></p>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Receiver Account Number</label>
              <input 
                type="text" 
                value={receiverAccount} 
                onChange={(e) => setReceiverAccount(e.target.value)} 
                required 
              />
            </div>
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
            <div className="form-group">
              <label>Description</label>
              <input 
                type="text" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-success">Send Money</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Transfer;
