import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Palette, Plus, ShoppingBag, Brush, Star, ArrowLeft,
  Layers, Image, Youtube, Sparkles, Trophy, Calendar,
  Edit, Trash2, LogOut, FileSpreadsheet, FileText, X, UploadCloud
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../GraphicDesignHub.css';
import './PartnerManagement.css'; // For modal styles

const categories = [
  { id: 'all',        label: 'All Designs',        icon: <Layers size={16} /> },
  { id: 'banner',     label: 'Banners',             icon: <Image size={16} /> },
  { id: 'posters',    label: 'Posters',             icon: <Palette size={16} /> },
  { id: 'yt-banner',  label: 'YouTube Banners',     icon: <Youtube size={16} /> },
  { id: 'festival',   label: 'Festival',            icon: <Sparkles size={16} /> },
  { id: 'tournament', label: 'Tournament Posters',  icon: <Trophy size={16} /> },
  { id: 'event',      label: 'Event Posters',       icon: <Calendar size={16} /> },
  { id: 'sheets',     label: 'Sheets',              icon: <FileSpreadsheet size={16} /> },
  { id: 'docs',       label: 'Docs',                icon: <FileText size={16} /> },
];

const GDPartnerDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'banner',
    badge: '',
    description: '',
    brand: 'UniXHub Originals',
    rating: '4.5',
    features: 'Secure Transaction, Instant Download, Free Updates, Premium Quality'
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/gd-products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`http://localhost:5000/api/gd-products/${id}`, { method: 'DELETE' });
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        console.error('Delete error', err);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price,
      category: product.category,
      badge: product.badge || '',
      description: product.description || '',
      brand: product.brand || 'UniXHub Originals',
      rating: product.rating || '4.5',
      features: product.features ? product.features.join(', ') : 'Secure Transaction, Instant Download, Free Updates, Premium Quality'
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      price: '',
      category: 'banner',
      badge: '',
      description: '',
      brand: 'UniXHub Originals',
      rating: '4.5',
      features: 'Secure Transaction, Instant Download, Free Updates, Premium Quality'
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('badge', formData.badge);
    data.append('description', formData.description);
    data.append('brand', formData.brand);
    data.append('rating', formData.rating);
    // Convert features back to array format
    if (formData.features) {
      const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f);
      data.append('features', JSON.stringify(featuresArray));
    }
    if(user && user._id) {
        data.append('partnerId', user._id);
    }
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      const url = editingProduct 
        ? `http://localhost:5000/api/gd-products/${editingProduct._id}`
        : `http://localhost:5000/api/gd-products`;
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: data });
      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts(); // Refresh list
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Error saving product');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    }
  };

  const filteredProducts = products.filter(p => activeCategory === 'all' || p.category === activeCategory);

  return (
    <div className="gdh-page">
      <Navbar minimal={true} />

      <section className="gdh-hero" style={{ padding: '40px 0' }}>
        <div className="gdh-hero-content container">
          <div className="gdh-hero-top-btns" style={{ justifyContent: 'space-between', width: '100%' }}>
            <div className="gdh-hero-badge">
              <Palette size={16} />
              <span>Partner Control Center: {user.name}</span>
            </div>
            <button className="gdh-back-btn" onClick={onLogout} style={{color: '#ef4444'}}>
              <LogOut size={18} /> Logout
            </button>
          </div>
          <h1 className="gdh-hero-title" style={{ fontSize: '2.5rem' }}>
            Manage Your <span className="text-gradient">Store Offerings</span>
          </h1>
          <button className="add-btn" onClick={handleOpenAdd} style={{ marginTop: '20px', padding: '12px 24px', fontSize: '1.1rem', background: 'linear-gradient(135deg, #8b5cf6, #d946ef)', color: 'white', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', border: 'none' }}>
            <Plus size={20} /> Add New Design
          </button>
        </div>
      </section>

      <div className="gdh-main-tabs container" style={{ marginTop: '20px' }}>
         <button className="gdh-main-tab active">
          <ShoppingBag size={18} /> Store Products
        </button>
      </div>

      <section className="gdh-store-section container">
        <div className="gdh-categories">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`gdh-cat-pill ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
        </div>

        <div className="gdh-grid">
          {filteredProducts.map(item => (
            <div key={item._id} className="gdh-card">
                <div className="gdh-card-img-wrap">
                  {item.badge && <span className={`gdh-badge bg-gradient`}>{item.badge}</span>}
                  <img src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} alt={item.title} className="gdh-card-img" />
                </div>
                <div className="gdh-card-body">
                  <h3 className="gdh-card-title">{item.title}</h3>
                  <div className="gdh-card-meta">
                    <div className="gdh-price"><span>₹{item.price}</span></div>
                    <div className="gdh-rating"><Star size={13} fill="#f59e0b" color="#f59e0b" /><span>{item.rating}</span></div>
                  </div>
                  <div className="gdh-card-actions" style={{ marginTop: '10px' }}>
                    <button className="gdh-btn-details" onClick={() => handleEdit(item)}>
                      <Edit size={15} /> Edit
                    </button>
                    <button className="gdh-btn-buy" onClick={() => handleDelete(item._id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid currentColor' }}>
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="gdh-empty" style={{ padding: '60px 0', textAlign: 'center' }}>
            <h3>No products found</h3>
            <p>Add some products to see them in your store.</p>
          </div>
        )}
      </section>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 1000}}>
          <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Design Product' : 'Add Design Product'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="service-form">
              <div className="form-group">
                <label>Product Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g., Premium Gaming Banner" />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g., 299" />
              </div>
              <div className="form-group">
                <label>Category & Badge</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ flex: 1 }}>
                    {categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                  <input type="text" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} placeholder="Badge (Optional: Hot)" style={{ flex: 1 }} />
                </div>
              </div>
              
              <div className="form-group">
                <label>Brand & Rating</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} placeholder="e.g., UniXHub Originals" style={{ flex: 2 }} />
                  <input type="number" step="0.1" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} placeholder="4.5" style={{ flex: 1 }} />
                </div>
              </div>

              <div className="form-group">
                <label>Features (Comma separated)</label>
                <input type="text" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} placeholder="e.g., Instant Download, Lifetime Access" />
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <div className="file-upload-container">
                  <label className="file-upload-label">
                    <input type="file" accept="image/*" onChange={e => {
                        if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
                    }} className="file-upload-input" />
                    <div style={{ color: '#94a3b8' }}><UploadCloud size={32} /></div>
                    <span>{imageFile ? "Click to Change Image" : (editingProduct ? "Change Current Image" : "Upload Image")}</span>
                  </label>
                  {imageFile && <div className="file-name-display">{imageFile.name}</div>}
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Provide product details..." style={{ width: '100%', borderRadius: '8px', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="submit-btn">{editingProduct ? 'Save Changes' : 'Publish Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GDPartnerDashboard;
