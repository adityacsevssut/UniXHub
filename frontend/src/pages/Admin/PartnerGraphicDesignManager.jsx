import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react'; // Import all icons
import { ArrowLeft, Plus, Trash2, Edit, X } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './DeveloperDashboard.css';

// Filter out non-component exports if any (usually Lucide exports components)
const iconList = Object.keys(LucideIcons).filter(key => key !== 'createLucideIcon' && key !== 'default');

const PartnerGraphicDesignManager = () => {
  const [items, setItems] = useState([]);
  const [showcaseItems, setShowcaseItems] = useState([]);
  const [activeTab, setActiveTab] = useState('quick_action');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkCount, setBulkCount] = useState(5);
  const [bulkSetupDone, setBulkSetupDone] = useState(false);
  const [bulkFormData, setBulkFormData] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Layout',
    iconType: 'lucide',
    color: '#000000',
    category: 'quick_action',
    buttonText: ''
  });

  const [showcaseForm, setShowcaseForm] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    category: 'General'
  });

  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'showcase') {
      fetchShowcase();
    } else {
      fetchItems();
    }
  }, [activeTab]);

  const fetchItems = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/graphic-design');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      showNotification('Failed to fetch items');
    }
  };

  const fetchShowcase = async () => {
    try {
      if (!user?._id) return;
      const res = await fetch(`http://localhost:5000/api/showcase?partnerId=${user._id}`);

      if (!res.ok) {
        if (res.status === 404) throw new Error('API not found (Restart Server)');
        throw new Error('Server error');
      }

      const data = await res.json();
      setShowcaseItems(data);
    } catch (err) {
      console.error(err);
      showNotification(err.message === 'API not found (Restart Server)' ? 'Please restart backend server!' : 'Failed to fetch items');
    }
  };

  const initBulkForms = () => {
    const forms = Array(bulkCount).fill().map(() => ({
      title: '',
      description: '',
      image: '',
      link: '',
      category: 'General'
    }));
    setBulkFormData(forms);
    setBulkSetupDone(true);
  };

  const handleBulkChange = (index, field, value) => {
    const updated = [...bulkFormData];
    updated[index][field] = value;
    setBulkFormData(updated);
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.imagePath) {
        handleBulkChange(index, 'image', data.imagePath);
      }
    } catch (err) {
      showNotification('File upload failed');
    }
  };

  const handleBulkSubmit = async () => {
    try {
      let addedCount = 0;
      for (const item of bulkFormData) {
        if (item.title && item.image) {
          await fetch('http://localhost:5000/api/showcase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...item, partnerId: user._id })
          });
          addedCount++;
        }
      }
      setIsBulkModalOpen(false);
      setBulkSetupDone(false);
      fetchShowcase();
      showNotification(`Successfully added ${addedCount} projects!`);
    } catch (err) {
      showNotification('Some items failed to upload');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const url = activeTab === 'showcase'
          ? `http://localhost:5000/api/showcase/${id}`
          : `http://localhost:5000/api/graphic-design/${id}`;

        await fetch(url, { method: 'DELETE' });

        if (activeTab === 'showcase') {
          setShowcaseItems(showcaseItems.filter(item => item._id !== id));
        } else {
          setItems(items.filter(item => item._id !== id));
        }
        showNotification('Item deleted successfully');
      } catch (err) {
        showNotification('Error deleting item');
      }
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'showcase') {
        const payload = { ...showcaseForm, partnerId: user._id };
        const res = await fetch('http://localhost:5000/api/showcase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const newItem = await res.json();
        setShowcaseItems([newItem, ...showcaseItems]);
      } else {
        const payload = { ...formData, category: activeTab };
        const res = await fetch('http://localhost:5000/api/graphic-design', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const newItem = await res.json();
        setItems([...items, newItem]);
      }
      setIsAdding(false);
      resetForm();
      showNotification('New item added successfully');
    } catch (err) {
      showNotification('Error adding item');
    }
  };

  const handleUpdateItem = async (e) => {
    // Only for graphic design items for now
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/graphic-design/${currentItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const updatedItem = await res.json();

      setItems(items.map(i => i._id === currentItem._id ? updatedItem : i));
      setIsEditing(false);
      resetForm();
      showNotification('Item updated successfully');
    } catch (err) {
      showNotification('Error updating item');
    }
  };

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      icon: item.icon,
      iconType: item.iconType || 'lucide',
      color: item.color,
      category: item.category,
      buttonText: item.buttonText || ''
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: 'Layout',
      iconType: 'lucide',
      color: '#000000',
      category: activeTab,
      buttonText: ''
    });
    setShowcaseForm({
      title: '',
      description: '',
      image: '',
      link: '',
      category: 'General'
    });
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const filteredItems = items.filter(item => item.category === activeTab);

  // Helper to render icon preview
  const renderIconPreview = (iconName, type, color, size = 24) => {
    if (type === 'url') {
      return <img src={iconName} alt="icon" style={{ width: size, height: size, objectFit: 'contain' }} />;
    }
    const IconComponent = LucideIcons[iconName];
    return IconComponent ? <IconComponent size={size} color={color} /> : null;
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
              onClick={() => navigate('/partner/dashboard')}
            />
            <div>
              <h1>Graphic Design Manager</h1>
              <p className="subtitle">Manage content for Graphic Design page</p>
            </div>
          </div>
          <button className="add-btn" onClick={() => { setIsAdding(true); resetForm(); }}>
            <Plus size={20} />
            {activeTab === 'quick_action' ? 'Add Top Quick Action' :
              activeTab === 'service' ? 'Add Service' : 'Add Single Project'}
          </button>
        </header>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0' }}>
          <button
            onClick={() => setActiveTab('quick_action')}
            style={{
              padding: '1rem',
              borderBottom: activeTab === 'quick_action' ? '2px solid #ec4899' : 'none',
              color: activeTab === 'quick_action' ? '#ec4899' : '#64748b',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Quick Actions
          </button>
          <button
            onClick={() => setActiveTab('service')}
            style={{
              padding: '1rem',
              borderBottom: activeTab === 'service' ? '2px solid #ec4899' : 'none',
              color: activeTab === 'service' ? '#ec4899' : '#64748b',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Services List
          </button>
          <button
            onClick={() => setActiveTab('showcase')}
            style={{
              padding: '1rem',
              borderBottom: activeTab === 'showcase' ? '2px solid #ec4899' : 'none',
              color: activeTab === 'showcase' ? '#ec4899' : '#64748b',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            My Work Showcase
          </button>
        </div>

        {notification && <div className="notification">{notification}</div>}

        {/* Add/Edit Modal */}
        {(isAdding || isEditing) && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
              <div className="modal-header">
                <h2>{isEditing ? 'Edit Item' : activeTab === 'showcase' ? 'Add Showcase Item' : `Add ${activeTab === 'quick_action' ? 'Quick Action' : 'Service'}`}</h2>
                <button className="close-btn" onClick={() => { setIsAdding(false); setIsEditing(false); }}><X size={24} /></button>
              </div>
              <form onSubmit={isEditing ? handleUpdateItem : handleAddItem} className="service-form">
                {activeTab === 'showcase' ? (
                  <>
                    <div className="form-group">
                      <label>Project Title</label>
                      <input
                        type="text"
                        required
                        value={showcaseForm.title}
                        onChange={(e) => setShowcaseForm({ ...showcaseForm, title: e.target.value })}
                        placeholder="e.g., Nike Campaign Banner"
                      />
                    </div>
                    <div className="form-group">
                      <label>Project Description</label>
                      <textarea
                        value={showcaseForm.description}
                        onChange={(e) => setShowcaseForm({ ...showcaseForm, description: e.target.value })}
                        placeholder="Brief details about the project..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Image Upload</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;

                          const formData = new FormData();
                          formData.append('image', file);

                          try {
                            const res = await fetch('http://localhost:5000/api/upload', {
                              method: 'POST',
                              body: formData
                            });
                            const data = await res.json();
                            if (data.imagePath) {
                              setShowcaseForm({ ...showcaseForm, image: data.imagePath });
                            }
                          } catch (err) {
                            showNotification('File upload failed');
                          }
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Or Image URL</label>
                      <input
                        type="url"
                        value={showcaseForm.image}
                        onChange={(e) => setShowcaseForm({ ...showcaseForm, image: e.target.value })}
                        placeholder="https://example.com/project-image.jpg"
                      />
                    </div>
                    <div className="form-group">
                      <label>External Link (Optional)</label>
                      <input
                        type="url"
                        value={showcaseForm.link}
                        onChange={(e) => setShowcaseForm({ ...showcaseForm, link: e.target.value })}
                        placeholder="https://behance.net/..."
                      />
                    </div>
                    {showcaseForm.image && (
                      <div className="form-group">
                        <label>Preview</label>
                        <img src={showcaseForm.image} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder={activeTab === 'quick_action' ? "e.g., Want to Design a Banner?" : "e.g., Social Media Posts"}
                      />
                    </div>

                    {activeTab === 'service' && (
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Brief description..."
                        />
                      </div>
                    )}

                    {activeTab === 'quick_action' && (
                      <div className="form-group">
                        <label>Button Text</label>
                        <input
                          type="text"
                          value={formData.buttonText}
                          onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                          placeholder="Default: Start Designing"
                        />
                      </div>
                    )}

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
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            style={{ fontFamily: 'monospace' }}
                          >
                            {iconList.map(iconName => (
                              <option key={iconName} value={iconName}>{iconName}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="url"
                            placeholder="https://example.com/icon.png"
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            required
                          />
                        )}
                      </div>
                    </div>

                    {/* Preview */}
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
                          {renderIconPreview(formData.icon, formData.iconType, formData.color, 32)}
                        </div>
                        <div>
                          <h4 style={{ margin: 0 }}>{formData.title || 'Title Preview'}</h4>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{formData.description || 'Description preview...'}</p>
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
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => { setIsAdding(false); setIsEditing(false); }}>Cancel</button>
                  <button type="submit" className="submit-btn">{isEditing ? 'Save Changes' : 'Add Item'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="services-grid">
          {activeTab === 'showcase' ? (
            <>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button
                  className="add-btn"
                  onClick={() => setIsBulkModalOpen(true)}
                  style={{ background: '#8b5cf6' }}
                >
                  <Plus size={20} /> Bulk Add Projects
                </button>
              </div>
              {showcaseItems.map(item => (
                <div key={item._id} className="service-card" style={{ borderTop: `4px solid #3b82f6` }}>
                  <div style={{ height: '150px', overflow: 'hidden', borderRadius: '8px 8px 0 0', marginBottom: '1rem' }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="card-footer" style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                    <a href={item.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', color: '#3b82f6' }}>View Link</a>
                    <button className="delete-btn" onClick={() => handleDelete(item._id)} title="Delete"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            filteredItems.map(item => (
              <div key={item._id} className="service-card" style={{ borderTop: `4px solid ${item.color}` }}>
                <div className="card-header">
                  <div className="service-icon" style={{ color: item.color, background: `${item.color}15` }}>
                    {renderIconPreview(item.icon, item.iconType, item.color, 24)}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="edit-btn" onClick={() => handleEditClick(item)} title="Edit" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                      <Edit size={18} />
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(item._id)} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <h3>{item.title}</h3>
                {item.description && <p>{item.description}</p>}
              </div>
            ))
          )}
        </div>

        {/* Bulk Upload Modal */}
        {isBulkModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="modal-header">
                <h2>Bulk Add Projects</h2>
                <button className="close-btn" onClick={() => setIsBulkModalOpen(false)}><X size={24} /></button>
              </div>

              {!bulkSetupDone ? (
                <div className="bulk-step-1">
                  <div className="form-group">
                    <label>How many projects do you want to add?</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={bulkCount}
                      onChange={(e) => setBulkCount(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="modal-actions">
                    <button className="submit-btn" onClick={initBulkForms}>Continue &rarr;</button>
                  </div>
                </div>
              ) : (
                <div className="bulk-step-2">
                  <p style={{ marginBottom: '1rem', color: '#666' }}>Fill in the details for your {bulkCount} projects.</p>
                  {bulkFormData.map((form, index) => (
                    <div key={index} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ marginBottom: '1rem', color: '#475569' }}>Project #{index + 1}</h4>
                      <div className="form-row">
                        <div className="form-group" style={{ flex: 1 }}>
                          <label>Title</label>
                          <input
                            type="text"
                            value={form.title}
                            onChange={(e) => handleBulkChange(index, 'title', e.target.value)}
                            placeholder="Project Title"
                          />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label>Category</label>
                          <input
                            type="text"
                            value={form.category}
                            onChange={(e) => handleBulkChange(index, 'category', e.target.value)}
                            placeholder="e.g. Logo"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          value={form.description}
                          onChange={(e) => handleBulkChange(index, 'description', e.target.value)}
                          rows="2"
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group" style={{ flex: 1 }}>
                          <label>Image Upload</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(index, e.target.files[0])}
                          />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label>Or Image URL</label>
                          <input
                            type="url"
                            value={form.image}
                            onChange={(e) => handleBulkChange(index, 'image', e.target.value)}
                            placeholder="http://..."
                          />
                        </div>
                      </div>
                      {form.image && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'green' }}>
                          Image ready: {form.image.substring(0, 30)}...
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="modal-actions">
                    <button className="cancel-btn" onClick={() => setBulkSetupDone(false)}>Back</button>
                    <button className="submit-btn" onClick={handleBulkSubmit}>Upload All Projects</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PartnerGraphicDesignManager;
