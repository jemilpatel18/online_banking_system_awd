import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/login');
      return;
    }
    setFormData({
      fullName: user.fullName || user.name || '',
      phone: user.phone || '',
      address: user.address || ''
    });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/users/${user._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setMessage('Error updating profile');
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <Sidebar role="user" />
      <div className="main-content">
        <h2>My Profile</h2>
        <div className="card form-container" style={{ margin: '0' }}>
          {message && <div className="alert alert-success">{message}</div>}
          
          {!isEditing ? (
            <div>
              <p><strong>Full Name:</strong> {user.fullName || user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Address:</strong> {user.address}</p>
              <p><strong>Account Number:</strong> {user.accountNumber}</p>
              <p><strong>Balance:</strong> ₹{user.balance}</p>
              <button onClick={() => setIsEditing(true)} className="btn btn-primary" style={{ marginTop: '15px' }}>
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} required rows="3"></textarea>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-success">Save</button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-danger">Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
