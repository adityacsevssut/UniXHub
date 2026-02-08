import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import './GraphicDesignDeveloperPanel.css';

// Helper for Icon Preview
const getIcon = (item, size) => {
  if (item.iconType === 'url') {
    return <img src={item.icon} alt="icon" style={{ width: size, height: size, objectFit: 'contain' }} />;
  }
  const IconComponent = LucideIcons[item.icon];
  return IconComponent ? <IconComponent size={size || 24} /> : <div style={{ fontSize: '0.7rem' }}>No Icon</div>;
};

const GraphicDesignDeveloperPanel = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Layout',
    iconType: 'lucide', // 'lucide' or 'url'
    color: '#3b82f6',
    buttonText: 'Start Designing',
    category: 'service',
    iconSearch: ''
  });

  // Get all valid icon names
  const allIconNames = Object.keys(LucideIcons);

  // Fetch Services from Backend
  const fetchServices = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/graphic-design');
      const data = await res.json();
      setServices(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/graphic-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        fetchServices();
        setFormData({ ...formData, title: '', description: '' });
        alert('Item added successfully!');
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  // Delete Item
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await fetch(`http://localhost:5000/api/graphic-design/${id}`, {
          method: 'DELETE'
        });
        fetchServices();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const quickActions = services.filter(s => s.category === 'quick_action');
  const serviceItems = services.filter(s => s.category === 'service');

  return (
    <div className="developer-panel-card">
      <header className="panel-header">
        <h2 className="panel-title">Graphic Design <span className="text-gradient">Manager</span></h2>
        <p>Control services and quick keys</p>
      </header>

      <div className="admin-dashboard-grid">
        {/* LEFT: Add New Item Form */}
        <div className="admin-form-card">
          <div className="form-title"><Plus size={24} className="text-primary" /> Add New Item</div>
          <form className="admin-form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Category Type</label>
              <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                <option value="service">Service List Item</option>
                <option value="quick_action">Quick Action Card</option>
              </select>
            </div>

            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Logo Design"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {formData.category === 'service' && (
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  placeholder="Short description of the service..."
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            )}

            <div className="form-group">
              <label>Icon Source</label>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio" name="iconType" value="lucide"
                    checked={formData.iconType === 'lucide'} onChange={handleChange}
                  /> Lucide Icon
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio" name="iconType" value="url"
                    checked={formData.iconType === 'url'} onChange={handleChange}
                  /> Custom URL
                </label>
              </div>

              {formData.iconType === 'lucide' ? (
                <div className="icon-selector-wrapper">
                  <input
                    type="text"
                    placeholder="Search icons..."
                    className="form-input"
                    style={{ marginBottom: '0.5rem' }}
                    value={formData.iconSearch}
                    onChange={(e) => setFormData({ ...formData, iconSearch: e.target.value })}
                  />
                  <div className="icon-grid-selector">
                    {allIconNames
                      .filter(name => name.toLowerCase().includes((formData.iconSearch || '').toLowerCase()) && typeof LucideIcons[name] !== 'function')
                      .slice(0, 300)
                      .map(iconName => {
                        const Icon = LucideIcons[iconName];
                        return (
                          <div
                            key={iconName}
                            className={`icon-option ${formData.icon === iconName ? 'selected' : ''}`}
                            onClick={() => setFormData({ ...formData, icon: iconName })}
                            title={iconName}
                          >
                            <Icon size={20} />
                          </div>
                        );
                      })}
                  </div>
                  <div style={{ fontSize: '0.75rem', marginTop: '0.2rem', color: '#94a3b8' }}>Showing up to 300 matching icons</div>
                </div>
              ) : (
                <input
                  type="text" name="icon" className="form-input"
                  placeholder="https://example.com/icon.png"
                  value={formData.icon} onChange={handleChange}
                />
              )}

              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                Preview: <span style={{ color: formData.color }}>{getIcon(formData, 24)}</span>
              </div>
            </div>

            {formData.category === 'quick_action' && (
              <div className="form-group">
                <label>Button Text</label>
                <input
                  type="text" name="buttonText" className="form-input"
                  value={formData.buttonText} onChange={handleChange}
                />
              </div>
            )}

            {formData.category === 'quick_action' && (
              <div className="form-group">
                <label>Accent Color</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    name="color"
                    className="form-input"
                    style={{ width: '60px', padding: '0.2rem' }}
                    value={formData.color}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="color"
                    className="form-input"
                    placeholder="#000000"
                    value={formData.color}
                    onChange={handleChange}
                    style={{ width: '100px' }}
                  />
                </div>
              </div>
            )}

            <button type="submit" className="submit-btn">
              Add to Database
            </button>
          </form>
        </div>

        {/* RIGHT: Existing Items List */}
        <div className="items-list-container">
          <div className="category-section">
            <h3>Quick Actions ({quickActions.length})</h3>
            <div className="admin-items-grid">
              {loading ? <p>Loading...</p> : quickActions.map(item => (
                <div key={item._id} className="admin-item-card">
                  <div className="item-header">
                    <div className="item-icon-preview" style={{ color: item.color, background: `${item.color}15` }}>
                      {getIcon(item, 24)}
                    </div>
                    <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="item-details">
                    <h4>{item.title}</h4>
                    <p style={{ fontSize: '0.8rem' }}>Color: {item.color}</p>
                    <p style={{ fontSize: '0.8rem' }}>Btn: {item.buttonText}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="category-section">
            <h3>Service Items ({serviceItems.length})</h3>
            <div className="admin-items-grid">
              {loading ? <p>Loading...</p> : serviceItems.map(item => (
                <div key={item._id} className="admin-item-card">
                  <div className="item-header">
                    <div className="item-icon-preview">
                      {getIcon(item, 24)}
                    </div>
                    <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="item-details">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphicDesignDeveloperPanel;
