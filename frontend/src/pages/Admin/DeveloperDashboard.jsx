import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { Layout, Palette, Code, Layers, FileText, Server, Monitor, Globe, CheckCircle, ArrowUpRight, Plus, Trash2, Edit, Save, X, Users, Briefcase, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './DeveloperDashboard.css';
import './PartnerManagement.css';

// Filter out non-component exports
const iconList = Object.keys(LucideIcons).filter(key => key !== 'createLucideIcon' && key !== 'default');

const DeveloperDashboard = () => {
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'services'
  const [services, setServices] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', iconName: 'Code', iconType: 'lucide', color: '#000000' });
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/services');
      const data = await res.json();
      setServices(data);
    } catch (err) {
      showNotification('Failed to fetch services');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await fetch(`http://localhost:5000/api/services/${id}`, { method: 'DELETE' });
        setServices(services.filter(service => service._id !== id));
        showNotification('Service deleted successfully');
      } catch (err) {
        showNotification('Error deleting service');
      }
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const newService = await res.json();
      setServices([...services, newService]);
      setIsAdding(false);
      resetForm();
      showNotification('New service added successfully');
    } catch (err) {
      showNotification('Error adding service');
    }
  };

  const handleEditClick = (service) => {
    setCurrentService(service);
    setFormData({
      title: service.title,
      description: service.description,
      iconName: service.iconName,
      iconType: service.iconType || 'lucide',
      color: service.color
    });
    setIsEditing(true);
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/services/${currentService._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const updatedService = await res.json();

      setServices(services.map(s => s._id === currentService._id ? updatedService : s));
      setIsEditing(false);
      resetForm();
      showNotification('Service updated successfully');
    } catch (err) {
      showNotification('Error updating service');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', iconName: 'Code', iconType: 'lucide', color: '#000000' });
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const renderIcon = (iconName, type, size = 24, color) => {
    if (type === 'url') {
      return <img src={iconName} alt="icon" style={{ width: size, height: size, objectFit: 'contain' }} />;
    }
    const IconComponent = LucideIcons[iconName];
    return IconComponent ? <IconComponent size={size} color={color} /> : <Code size={size} color={color} />;
  };

  return (
    <div className="dev-dashboard">
      <Navbar />

      {view === 'dashboard' ? (
        <div className="dashboard-container">
          <div className="dashboard-welcome">
            <h1>Welcome to Developer Panel</h1>
            <p>Control center for UniXHub ecosystem. Manage your services, partners, and platform configurations from one central hub.</p>
          </div>

          <div className="dashboard-cards">
            <div className="dashboard-card" onClick={() => setView('services')}>
              <div className="card-icon-wrapper" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                <Layers size={40} />
              </div>
              <h3>Manage Services</h3>
              <p>Configure platform service offerings, update descriptions, and manage icons.</p>
            </div>

            <div className="dashboard-card" onClick={() => navigate('/admin/partners')}>
              <div className="card-icon-wrapper" style={{ background: '#fdf2f8', color: '#ec4899' }}>
                <Users size={40} />
              </div>
              <h3>Manage Partners</h3>
              <p>Oversee partner accounts, manage access credentials, and monitor recruitment.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="dashboard-container">
          <div style={{ marginBottom: '1.5rem' }}>
            <button className="back-btn" onClick={() => setView('dashboard')}>
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
          </div>

          <header className="dashboard-header">
            <div>
              <h1>Service Management</h1>
              <p className="subtitle">Manage and configure platform services</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="add-btn" onClick={() => { setIsAdding(true); resetForm(); }}>
                <Plus size={20} /> Add New Service
              </button>
            </div>
          </header>

          {notification && <div className="notification">{notification}</div>}

          {/* Add/Edit Modal */}
          {(isAdding || isEditing) && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                  <h2>{isEditing ? 'Edit Service' : 'Add New Service'}</h2>
                  <button className="close-btn" onClick={() => { setIsAdding(false); setIsEditing(false); }}><X size={24} /></button>
                </div>
                <form onSubmit={isEditing ? handleUpdateService : handleAddService} className="service-form">
                  <div className="form-group">
                    <label>Service Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Mobile App Development"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of the service..."
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Icon Source</label>
                      <select
                        value={formData.iconType}
                        onChange={(e) => setFormData({ ...formData, iconType: e.target.value })}
                      >
                        <option value="lucide">Lucide Icon Library</option>
                        <option value="url">Custom Image URL</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ flex: 2 }}>
                      <label>{formData.iconType === 'lucide' ? 'Select Icon' : 'Image URL'}</label>
                      {formData.iconType === 'lucide' ? (
                        <select
                          value={formData.iconName}
                          onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                          style={{ fontFamily: 'monospace' }}
                        >
                          {iconList.map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="url"
                          placeholder="https://example.com/icon.png"
                          value={formData.iconName}
                          onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                          required
                        />
                      )}
                    </div>
                  </div>

                  {/* Icon Preview */}
                  <div className="form-group">
                    <label>Preview</label>
                    <div style={{
                      padding: '1rem',
                      border: '1px dashed #ccc',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: '#f8fafc'
                    }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        background: `${formData.color}20`,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: formData.color
                      }}>
                        {renderIcon(formData.iconName, formData.iconType, 32, formData.color)}
                      </div>
                      <div>
                        <h4 style={{ margin: 0 }}>{formData.title || 'Title Preview'}</h4>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Theme Color</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        style={{ height: '42px', width: '60px', padding: '2px', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        placeholder="#000000"
                        style={{ flex: 1 }}
                        pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                      />
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="cancel-btn" onClick={() => { setIsAdding(false); setIsEditing(false); }}>Cancel</button>
                    <button type="submit" className="submit-btn">{isEditing ? 'Save Changes' : 'Add Service'}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="services-grid">
            {services.map(service => (
              <div key={service._id} className="service-card" style={{ borderTop: `4px solid ${service.color}` }}>
                <div className="card-header">
                  <div className="service-icon" style={{ color: service.color, background: `${service.color}15` }}>
                    {renderIcon(service.iconName, service.iconType, 24)}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="edit-btn" onClick={() => handleEditClick(service)} title="Edit Service" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                      <Edit size={18} />
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(service._id)} title="Delete Service">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="card-footer">
                  <span className="service-id">ID: {service._id.substring(service._id.length - 6)}</span>
                  <span className="status-badge">Active</span>
                </div>
              </div>
            ))}
          </div>

          <footer className="dashboard-footer">
            &copy; {new Date().getFullYear()} UniXHub Developer Console. All rights reserved.
          </footer>
        </div>
      )}
    </div>
  );
};

export default DeveloperDashboard;
