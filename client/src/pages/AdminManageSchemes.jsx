import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const emptyForm = {
  name: '',
  type: 'regular',
  category: '',
  description: '',
  benefits: '',
  eligibility: '',
  interestRate: '',
  tenure: '',
  minAmount: '',
  maxAmount: '',
  status: 'Active',
  startDate: '',
  endDate: '',
  festivalYear: '',
  icon: ''
};

function AdminManageSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('schemes');
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchSchemes();
    fetchApplications();
  }, [currentUser, navigate]);

  const fetchSchemes = async () => {
    try {
      const response = await api.get('/api/schemes');
      setSchemes(response.data || []);
    } catch (err) {
      console.error('Error fetching schemes', err);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await api.get('/api/admin/schemes/applications');
      setApplications(response.data || []);
    } catch (err) {
      console.error('Error fetching applications', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const payload = {
        ...formData,
        interestRate: formData.interestRate ? Number(formData.interestRate) : undefined,
        minAmount: formData.minAmount ? Number(formData.minAmount) : undefined,
        maxAmount: formData.maxAmount ? Number(formData.maxAmount) : undefined,
        festivalYear: formData.festivalYear ? Number(formData.festivalYear) : undefined
      };

      await api.post('/api/admin/schemes', payload);
      setMessage('Scheme created successfully');
      setFormData(emptyForm);
      fetchSchemes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create scheme');
    }
  };

  const handleDeleteScheme = async (id) => {
    if (!window.confirm('Delete this scheme?')) return;

    try {
      await api.delete(`/api/admin/schemes/${id}`);
      setMessage('Scheme deleted successfully');
      fetchSchemes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete scheme');
    }
  };

  const handleUpdateApplicationStatus = async (appId, newStatus) => {
    try {
      await api.put(`/api/admin/schemes/applications/${appId}`, { status: newStatus });
      setMessage('Application status updated');
      fetchApplications();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#28a745';
      case 'Upcoming': return '#ffc107';
      case 'Expired': return '#dc3545';
      case 'Pending': return '#ffc107';
      case 'Approved': return '#28a745';
      case 'Rejected': return '#dc3545';
      case 'Completed': return '#007bff';
      default: return '#6c757d';
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar role="admin" />
      <div className="main-content">
        <h2>Manage Banking Schemes</h2>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Tab Navigation */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('schemes')}
            className="btn"
            style={{
              marginRight: '10px',
              backgroundColor: activeTab === 'schemes' ? '#007bff' : '#6c757d',
              color: '#fff'
            }}
          >
            Schemes
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className="btn"
            style={{
              backgroundColor: activeTab === 'applications' ? '#007bff' : '#6c757d',
              color: '#fff'
            }}
          >
            Applications
          </button>
        </div>

        {activeTab === 'schemes' && (
          <>
            {/* Create New Scheme Form */}
            <div className="card form-container" style={{ marginBottom: '20px' }}>
              <h3>Create New Scheme</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Scheme Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} required>
                    <option value="regular">Regular Banking Scheme</option>
                    <option value="festival">Festival Special Offer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="e.g., FD, RD, Savings" required />
                </div>
                <div className="form-group">
                  <label>Icon (Emoji)</label>
                  <input type="text" name="icon" value={formData.icon} onChange={handleChange} placeholder="e.g., 🏦, 🎉" />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" rows="3" value={formData.description} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Benefits</label>
                  <textarea name="benefits" rows="2" value={formData.benefits} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Eligibility</label>
                  <textarea name="eligibility" rows="2" value={formData.eligibility} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Interest Rate (%) (Optional)</label>
                  <input type="number" step="0.1" name="interestRate" value={formData.interestRate} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Tenure (Optional)</label>
                  <input type="text" name="tenure" value={formData.tenure} onChange={handleChange} placeholder="e.g., 1-5 years" />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Min Amount (₹)</label>
                    <input type="number" name="minAmount" value={formData.minAmount} onChange={handleChange} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Max Amount (₹)</label>
                    <input type="number" name="maxAmount" value={formData.maxAmount} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} required>
                    <option value="Active">Active</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>End Date</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                  </div>
                </div>
                {formData.type === 'festival' && (
                  <div className="form-group">
                    <label>Festival Year</label>
                    <input type="number" name="festivalYear" value={formData.festivalYear} onChange={handleChange} placeholder="e.g., 2024" />
                  </div>
                )}
                <button type="submit" className="btn btn-primary">Create Scheme</button>
              </form>
            </div>

            {/* Schemes List */}
            <div className="card">
              <h3>All Schemes</h3>
              {schemes.length === 0 ? (
                <p>No schemes found.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Interest Rate</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schemes.map(scheme => (
                        <tr key={scheme._id}>
                          <td>{scheme.icon} {scheme.name}</td>
                          <td>{scheme.type}</td>
                          <td>{scheme.category}</td>
                          <td>{scheme.interestRate ? `${scheme.interestRate}%` : '-'}</td>
                          <td>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              backgroundColor: getStatusColor(scheme.status),
                              color: '#fff',
                              fontSize: '12px'
                            }}>
                              {scheme.status}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => handleDeleteScheme(scheme._id)}
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
              )}
            </div>
          </>
        )}

        {activeTab === 'applications' && (
          <div className="card">
            <h3>Scheme Applications</h3>
            {applications.length === 0 ? (
              <p>No applications found.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Scheme</th>
                      <th>Amount</th>
                      <th>Tenure</th>
                      <th>Status</th>
                      <th>Applied Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app._id}>
                        <td>{app.user?.fullName || app.user?.email || 'N/A'}</td>
                        <td>{app.scheme?.name || 'N/A'}</td>
                        <td>₹{app.amount || 0}</td>
                        <td>{app.tenure || '-'}</td>
                        <td>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: getStatusColor(app.status),
                            color: '#fff',
                            fontSize: '12px'
                          }}>
                            {app.status}
                          </span>
                        </td>
                        <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td>
                          {app.status === 'Pending' && (
                            <div style={{ display: 'flex', gap: '5px' }}>
                              <button
                                onClick={() => handleUpdateApplicationStatus(app._id, 'Approved')}
                                className="btn btn-success"
                                style={{ padding: '5px 10px', fontSize: '12px' }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateApplicationStatus(app._id, 'Rejected')}
                                className="btn btn-danger"
                                style={{ padding: '5px 10px', fontSize: '12px' }}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {app.status === 'Approved' && (
                            <button
                              onClick={() => handleUpdateApplicationStatus(app._id, 'Completed')}
                              className="btn btn-primary"
                              style={{ padding: '5px 10px', fontSize: '12px' }}
                            >
                              Mark Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default AdminManageSchemes;
