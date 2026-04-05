import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Palette, ShoppingBag, Brush, Star, ArrowLeft,
  Layers, Image, Youtube, Sparkles, Trophy, Calendar,
  ShoppingCart, Eye, Tag, Zap, Search, SlidersHorizontal,
  FileSpreadsheet, FileText
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './GraphicDesignHub.css';

// ─── Store Data ───────────────────────────────────────────────────────────────
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

// Removing static storeSections data

// ─── Store Card ───────────────────────────────────────────────────────────────
const StoreCard = ({ item, onZoom }) => {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  const badgeColor =
    item.badge === 'Best Seller' ? 'badge-pink' :
    item.badge === 'New'         ? 'badge-green' :
    item.badge === 'Popular'     ? 'badge-blue' :
    item.badge === 'Trending'    ? 'badge-violet' :
    item.badge === 'Hot'         ? 'badge-red' : '';

  return (
    <div className="gdh-card">
      <div className="gdh-card-img-wrap">
        {item.badge && (
          <span className={`gdh-badge ${badgeColor}`}>{item.badge}</span>
        )}
        {imgError ? (
          <div className="gdh-card-img-placeholder">
            <Palette size={40} color="#8b5cf6" />
          </div>
        ) : (
          <img
            src={item.image && item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
            alt={item.title}
            className="gdh-card-img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
        <div className="gdh-card-overlay">
          <button className="gdh-overlay-btn" onClick={() => onZoom(item)}>
            <Eye size={16} /> Preview
          </button>
        </div>
      </div>

      <div className="gdh-card-body">
        <h3 className="gdh-card-title">{item.title}</h3>

        <div className="gdh-card-meta">
          <div className="gdh-rating">
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            <span>{item.rating}</span>
          </div>
          <div className="gdh-price">
            <Tag size={13} />
            <span>₹{item.price}</span>
          </div>
        </div>

        <div className="gdh-card-actions">
          <button className="gdh-btn-details" onClick={() => navigate(`/graphic-design-hub/${item._id || item.id}`, { state: { product: item } })}>
            <Eye size={15} /> Details
          </button>
          <button className="gdh-btn-buy">
            <ShoppingCart size={15} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const GraphicDesignHub = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery]       = useState('');
  const [activeTab, setActiveTab]           = useState('store');
  const [selectedImage, setSelectedImage]   = useState(null);
  const [products, setProducts]             = useState([]);

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

  const getEmojiForCategory = (catId) => {
    const emojis = { banner: '🖼️', posters: '🎨', 'yt-banner': '▶️', festival: '🎉', tournament: '🏆', event: '📅', sheets: '📊', docs: '📄' };
    return emojis[catId] || '✨';
  };

  const getTitleForCategory = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.label : 'Designs';
  };

  // Group products by category dynamically
  const groupedProducts = categories
    .filter(cat => cat.id !== 'all' && (activeCategory === 'all' || cat.id === activeCategory))
    .map(cat => ({
      id: cat.id,
      title: getTitleForCategory(cat.id),
      emoji: getEmojiForCategory(cat.id),
      items: products.filter(p => p.category === cat.id && p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }))
    .filter(section => section.items.length > 0);

  return (
    <div className="gdh-page">
      <Navbar />

      {/* ── Hero Banner ─────────────────────────────── */}
      <section className="gdh-hero">
        <div className="gdh-hero-content container">
          <div className="gdh-hero-top-btns">
            <button className="gdh-back-btn" onClick={() => navigate('/')}>
              <ArrowLeft size={18} /> Back to Services
            </button>

            <div className="gdh-hero-badge">
              <Palette size={16} />
              <span>Graphic Design Hub</span>
            </div>
          </div>

          <h1 className="gdh-hero-title">
            Premium Designs <br />
            <span className="text-gradient">For Every Occasion</span>
          </h1>
          <p className="gdh-hero-sub">
            Explore our curated collection of professional banners, posters, YouTube art,
            festival templates, and tournament graphics — crafted to wow your audience.
          </p>


        </div>
      </section>

      {/* ── Tabs ────────────────────────────────────── */}
      <div className="gdh-main-tabs container">
        <button
          className={`gdh-main-tab ${activeTab === 'store' ? 'active' : ''}`}
          onClick={() => setActiveTab('store')}
        >
          <ShoppingBag size={18} /> Browse Store
        </button>
        <button
          className={`gdh-main-tab ${activeTab === 'custom' ? 'active' : ''}`}
          onClick={() => setActiveTab('custom')}
        >
          <Brush size={18} /> Custom Design
        </button>
      </div>

      {activeTab === 'store' ? (
        <section className="gdh-store-section container">

          {/* Search + Filter Bar */}
          <div className="gdh-filter-bar">
            <div className="gdh-search-wrap">
              <Search size={18} className="gdh-search-icon" />
              <input
                className="gdh-search-input"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="gdh-filter-icon-wrap">
              <SlidersHorizontal size={20} />
            </div>
          </div>

          {/* Category Pills */}
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

          {/* Sections */}
          {groupedProducts.length > 0 ? (
            groupedProducts.map(section => (
              <div key={section.id} className="gdh-section" id={section.id}>
                <div className="gdh-section-header">
                  <span className="gdh-section-emoji">{section.emoji}</span>
                  <h2 className="gdh-section-title">{section.title}</h2>
                  <span className="gdh-section-count">{section.items.length} items</span>
                </div>
                <div className="gdh-grid">
                  {section.items.map(item => (
                    <StoreCard key={item._id} item={item} onZoom={setSelectedImage} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="gdh-empty">
              <Palette size={60} color="#8b5cf6" />
              <h3>No designs found</h3>
              <p>Try a different search or category.</p>
            </div>
          )}
        </section>
      ) : (
        /* ── Custom Design Tab ───────────────────────── */
        <section className="gdh-custom-section container">
          <div className="gdh-custom-card">
            <div className="gdh-custom-icon-wrap">
              <Brush size={48} />
            </div>
            <h2 className="gdh-custom-title">Custom Design Services</h2>
            <p className="gdh-custom-desc">
              Need something uniquely yours? Our talented team of designers will craft
              bespoke visuals tailored to your brand identity, event theme, or campaign —
              from scratch, just for you.
            </p>

            <div className="gdh-custom-features">
              {[
                { icon: '🎯', title: 'Brand-Tailored',   desc: 'Designed to match your colors, fonts, and identity.' },
                { icon: '⚡', title: 'Fast Turnaround',   desc: 'Most custom orders delivered within 24–48 hours.' },
                { icon: '🔁', title: 'Free Revisions',    desc: 'Up to 3 rounds of revisions included.' },
                { icon: '🔒', title: '100% Original',     desc: 'Your design, your rights. No templates reused.' },
              ].map((f, i) => (
                <div className="gdh-feature-card" key={i}>
                  <span className="gdh-feature-emoji">{f.icon}</span>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="gdh-custom-cta">
              <span className="gdh-coming-soon-badge">
                <Sparkles size={14} /> Coming Soon
              </span>
              <p>Leave your email to get notified when custom orders open!</p>
              <div className="gdh-notify-form">
                <input type="email" placeholder="your@email.com" className="gdh-notify-input" />
                <button className="gdh-notify-btn btn-primary">Notify Me</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Zoom Modal ───────────────────────────────── */}
      {selectedImage && (
        <div className="gdh-zoom-modal" onClick={() => setSelectedImage(null)}>
          <div className="gdh-zoom-content" onClick={e => e.stopPropagation()}>
            <button className="gdh-zoom-close" onClick={() => setSelectedImage(null)}>✕</button>
            <img src={selectedImage.image && selectedImage.image.startsWith('http') ? selectedImage.image : `http://localhost:5000${selectedImage.image}`} alt={selectedImage.title} className="gdh-zoom-img" />
            <div className="gdh-zoom-info">
              <h3>{selectedImage.title}</h3>
              <p>Zoomed view for better pictorial representation</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GraphicDesignHub;
