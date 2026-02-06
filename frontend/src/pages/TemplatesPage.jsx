import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, Copy, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './TemplatesModal.css';

const TemplatesModalPage = () => {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState(null);

  // Mock Templates
  const templates = [
    { id: 101, url: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?w=400&q=80', title: 'Modern Resume' },
    { id: 102, url: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=400&q=80', title: 'Minimal Logo' },
    { id: 103, url: 'https://images.unsplash.com/photo-1611532736597-28d584b6f0ff?w=400&q=80', title: 'Tech Banner' },
    { id: 104, url: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=400&q=80', title: 'Invoice Green' },
    { id: 105, url: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d0f?w=400&q=80', title: 'Event Flyer' },
    { id: 106, url: 'https://images.unsplash.com/photo-1558655146-d09347e0c708?w=400&q=80', title: 'App UI Kit' },
    { id: 107, url: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&q=80', title: 'Abstract BG' },
    { id: 108, url: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=400&q=80', title: 'Business Card' },
  ];

  const handleCopy = async (url, id) => {
    try {
      // 1. Fetch the image directly
      const response = await fetch(url);
      const blob = await response.blob();

      // 2. Write to clipboard
      // Modern browsers (Chrome 87+) support image/png and image/jpeg
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (mimeErr) {
        // 3. Fallback for browsers strict about PNGs
        // If blob is jpeg but browser wants png, we can't easily convert without canvas
        // So we explicitly tell user or try link
        console.warn("Browser rejected MIME type:", blob.type);
        throw new Error("MIME type not supported for copy");
      }

    } catch (err) {
      console.error('Copy failed:', err);
      // Fallback: Copy URL
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      alert("Browser blocked image copy. Link copied instead. (Try Right-Click > Copy Image)");
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="templates-page-overlay">
      <div className="templates-modal glass-card">
        <div className="modal-header">
          <h2>Available Templates</h2>
          <button className="close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <p className="modal-subtitle">Click to copy image and paste directly into chat.</p>

        <div className="templates-grid">
          {templates.map((template) => (
            <div key={template.id} className="template-card">
              <div className="template-image">
                <img src={template.url} alt={template.title} />
                <div className="template-overlay">
                  <button
                    className="copy-btn"
                    onClick={() => handleCopy(template.url, template.id)}
                  >
                    {copiedId === template.id ? (
                      <>
                        <Check size={18} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={18} /> Copy Image
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="template-title">{template.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplatesModalPage;
