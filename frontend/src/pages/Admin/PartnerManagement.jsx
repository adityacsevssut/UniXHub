import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Trash2, X, ArrowLeft, UploadCloud, Edit, Eye, EyeOff } from 'lucide-react';
import Navbar from '../../components/Navbar';
import './DeveloperDashboard.css';
import './PartnerManagement.css';

const PartnerManagement = () => {
  const [partners, setPartners] = useState([]);
  const [services, setServices] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingPartner, setEditingPartner] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessId: 'GD_PARTNER',
    serviceId: 'Graphic Design',
    password: '',
    image: ''
  });
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPartners();
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/services');
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error('Failed to fetch services');
    }
  };

  const fetchPartners = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/partners');
      const data = await res.json();
      setPartners(data);
    } catch (err) {
      showNotification('Failed to fetch partners');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        await fetch(`http://localhost:5000/api/partners/${id}`, { method: 'DELETE' });
        setPartners(partners.filter(p => p._id !== id));
        showNotification('Partner deleted successfully');
      } catch (err) {
        showNotification('Error deleting partner');
      }
    }
  };

  const handleEdit = (partner) => {
    setEditingId(partner._id);
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      email: partner.email,
      businessId: partner.businessId,
      serviceId: partner.serviceId,
      password: '', // Keep empty unless changing
      image: partner.image || ''
    });
    setImageFile(null);
    setShowPassword(false);
    setIsAdding(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('businessId', formData.businessId);
      data.append('serviceId', formData.serviceId);
      if (formData.password) {
        data.append('password', formData.password);
      }
      if (imageFile) {
        data.append('image', imageFile);
      }

      const url = editingId
        ? `http://localhost:5000/api/partners/${editingId}`
        : 'http://localhost:5000/api/partners';

      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        body: data
      });

      let resData;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        resData = await res.json();
      } else {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        // Extract a preview of the error to show in the UI, cleaning up HTML tags if possible or just showing raw text
        const preview = text.substring(0, 100).replace(/<[^>]*>?/gm, '');
        throw new Error(`Server Error: ${preview}...`);
      }

      if (res.ok) {
        if (editingId) {
          setPartners(partners.map(p => p._id === editingId ? resData : p));
          showNotification('Partner updated successfully');
        } else {
          setPartners([...partners, resData]);
          showNotification('Partner added successfully');
        }
        setIsAdding(false);
        resetForm();
      } else {
        console.error('Server error:', resData);
        showNotification(resData.message || 'Error saving partner');
      }
    } catch (err) {
      console.error('Submission error:', err);
      showNotification('Error: ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      businessId: 'GD_PARTNER',
      serviceId: 'Graphic Design',
      password: '',
      image: ''
    });
    setImageFile(null);
    setEditingId(null);
    setEditingPartner(null);
    setShowPassword(false);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="dev-dashboard">
      <Navbar />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ArrowLeft
              size={24}
              style={{ cursor: 'pointer', color: '#64748b' }}
              onClick={() => navigate('/admin/dashboard')}
            />
            <div>
              <h1>Partner Management</h1>
              <p className="subtitle">Create and manage partner access credentials</p>
            </div>
          </div>
          <button className="add-btn" onClick={() => { setIsAdding(true); resetForm(); }}>
            <Plus size={20} /> Add New Partner
          </button>
        </header>

        {notification && <div className="notification">{notification}</div>}

        {/* Add Modal */}
        {isAdding && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editingId ? 'Edit Partner' : 'Add New Partner'}</h2>
                <button className="close-btn" onClick={() => setIsAdding(false)}><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="service-form">
                <div className="form-group">
                  <label>Partner Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., John Doe"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="partner@business.com"
                  />
                </div>
                <div className="form-group">
                  <label>Profile Image</label>
                  <div className="file-upload-container">
                    <label className="file-upload-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImageFile(e.target.files[0]);
                          }
                        }}
                        className="file-upload-input"
                      />
                      <div style={{ color: '#94a3b8' }}><UploadCloud size={32} /></div>
                      <span style={{ fontSize: '0.95rem' }}>
                        {imageFile ? "Click to Change Image" : (formData.image ? "Change Current Image" : "Click to Upload Profile Photo")}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 400 }}>JPG, PNG allowed</span>
                    </label>

                    {imageFile && (
                      <div className="file-name-display">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
                          {imageFile.name}
                        </span>
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={() => {
                            setImageFile(null);
                          }}
                          title="Remove file"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Business ID</label>
                    <input
                      type="text"
                      required
                      value={formData.businessId}
                      onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                      placeholder="e.g., GD_PARTNER_01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Service Type</label>
                    <select
                      value={formData.serviceId}
                      onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    >
                      <option value="Graphic Design">Graphic Design</option>
                      {services
                        .filter(s => s.title !== 'Graphic Design')
                        .map(service => (
                          <option key={service._id} value={service.title}>{service.title}</option>
                        ))}
                    </select>
                  </div>
                </div>

                {editingId && (
                  <div className="form-group">
                    <label>Current Password <span style={{ fontWeight: 'normal', fontSize: '0.8em', color: '#666' }}>(Visible to Developer)</span></label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={editingPartner?.plainPassword || 'Not available (Old account)'}
                        readOnly
                        disabled
                        style={{ background: '#f8fafc', color: '#334155', fontWeight: 500, letterSpacing: '0.5px' }}
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>{editingId ? "New Password" : "Password"}</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      required={!editingId}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={editingId ? "Enter new password to change" : "Set a secure password"}
                      style={{ paddingRight: '40px' }}
                    />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {!editingId && <small style={{ color: '#64748b', marginTop: '0.25rem', display: 'block' }}>Provide this password to the partner securely.</small>}
                  {editingId && <small style={{ color: '#64748b', marginTop: '0.25rem', display: 'block' }}>Leave blank to keep current password.</small>}
                </div>

                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setIsAdding(false)}>Cancel</button>
                  <button type="submit" className="submit-btn">{editingId ? 'Save Changes' : 'Create Partner'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="services-grid">
          {partners.map(partner => (
            <div key={partner._id} className="service-card" style={{ borderTop: `4px solid #ec4899` }}>
              <div className="card-header">
                <div className="service-icon" style={{ color: '#ec4899', background: '#ec489915' }}>
                  <Users size={24} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(partner)}
                    title="Edit Partner"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#3b82f6', padding: '8px', borderRadius: '8px', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#eff6ff'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Edit size={18} />
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(partner._id)} title="Delete Partner">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <h3>{partner.name}</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{partner.email}</p>
              <div className="card-footer" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span className="service-id">Business ID: <strong>{partner.businessId}</strong></span>
                <span className="status-badge" style={{ background: '#e0f2fe', color: '#0ea5e9' }}>{partner.serviceId}</span>
              </div>
            </div>
          ))}
        </div>

        <footer className="dashboard-footer">
          &copy; {new Date().getFullYear()} UniXHub Developer Console. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default PartnerManagement;
