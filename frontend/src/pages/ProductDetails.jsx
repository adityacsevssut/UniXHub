import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Package, ShieldCheck, Truck, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ProductDetails.css';

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (location.state && location.state.product) {
      setProduct(location.state.product);
    } else {
      // Direct navigation without state or refresh.
      // We would normally fetch data, but here we redirect back to hub since we use mock data.
      navigate('/graphic-design-hub');
    }
  }, [location.state, navigate, id]);

  if (!product) return null;

  return (
    <div className="product-details-page">
      <Navbar />
      <div className="container product-details-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back to Hub
        </button>

        <div className="product-details-content">
          <div className="product-image-section">
            <img src={product.image && product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} alt={product.title} className="product-main-image" />
          </div>

          <div className="product-info-section">
            {product.badge && <span className="product-badge">{product.badge}</span>}
            <h1 className="product-title">{product.title}</h1>
            <div className="product-brand">
              <Package size={16} /> Brand: <span className="highlight-brand">{product.brand || 'UniXHub Originals'}</span>
            </div>
            
            <div className="product-meta">
              <div className="product-rating">
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span>{product.rating} / 5.0</span>
              </div>
            </div>

            <div className="product-price">
              <span className="price-symbol">₹</span>
              <span className="price-amount">{product.price}</span>
            </div>

            <div className="product-description">
              <h3>About this item</h3>
              <p>{product.description || 'High-quality digital design ready for your use. Perfect for any professional or creative project. Grab it now and enhance your visual identity. Included with standard licensing rights and easily customizable.'}</p>
            </div>

            <div className="product-features">
              {product.features && product.features.length > 0 ? (
                product.features.map((feature, idx) => (
                  <div key={idx} className="feature-item">
                    <ShieldCheck size={18} /> {feature}
                  </div>
                ))
              ) : (
                <>
                  <div className="feature-item"><ShieldCheck size={18} /> Secure Transaction</div>
                  <div className="feature-item"><Zap size={18} /> Instant Download</div>
                  <div className="feature-item"><Truck size={18} /> Free Updates</div>
                  <div className="feature-item"><Star size={18} /> Premium Quality</div>
                </>
              )}
            </div>

            <div className="product-buy-options">
              <button className="btn-add-cart">
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button className="btn-buy-now">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
