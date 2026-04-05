import React from 'react';

const storeSections = [
  {
    title: 'Banner',
    id: 'banner',
    items: Array.from({ length: 10 }).map((_, i) => ({
      id: `banner-${i}`,
      title: `Professional Business Banner ${i + 1}`,
      price: `₹${(Math.random() * 500 + 499).toFixed(0)}`,
      image: `https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600&h=338`
    }))
  },
  {
    title: 'Posters',
    id: 'posters',
    items: Array.from({ length: 10 }).map((_, i) => ({
      id: `poster-${i}`,
      title: `Creative Modern Poster ${i + 1}`,
      price: `₹${(Math.random() * 300 + 199).toFixed(0)}`,
      image: `https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600&h=338`
    }))
  },
  {
    title: 'YouTube Banner',
    id: 'yt-banner',
    items: Array.from({ length: 10 }).map((_, i) => ({
      id: `yt-banner-${i}`,
      title: `Gaming / Tech YouTube Banner ${i + 1}`,
      price: `₹${(Math.random() * 400 + 299).toFixed(0)}`,
      image: `https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600&h=338`
    }))
  },
  {
    title: 'Festival Banners and Posters',
    id: 'festival',
    items: Array.from({ length: 10 }).map((_, i) => ({
      id: `festival-${i}`,
      title: `Happy Diwali / Holi Design ${i + 1}`,
      price: `₹${(Math.random() * 200 + 99).toFixed(0)}`,
      image: `https://images.unsplash.com/photo-1582230237748-0b5c17fae446?auto=format&fit=crop&q=80&w=600&h=338`
    }))
  },
  {
    title: 'Tournament Posters',
    id: 'tournament',
    items: Array.from({ length: 10 }).map((_, i) => ({
      id: `tourney-${i}`,
      title: `Esports BGMI/Valorant Poster ${i + 1}`,
      price: `₹${(Math.random() * 600 + 399).toFixed(0)}`,
      image: `https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600&h=338`
    }))
  },
  {
    title: 'Event Posters',
    id: 'event',
    items: Array.from({ length: 10 }).map((_, i) => ({
      id: `event-${i}`,
      title: `Music Festival / Tech Meetup ${i + 1}`,
      price: `₹${(Math.random() * 500 + 299).toFixed(0)}`,
      image: `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600&h=338`
    }))
  }
];

const GraphicDesignStore = () => {
  return (
    <div className="store-container">
      {storeSections.map((section) => (
        <div key={section.id} className="store-section" id={section.id}>
          <h2 className="store-section-title">{section.title}</h2>

          <div className="store-grid">
            {section.items.map((item) => (
              <div key={item.id} className="store-card">
                <div className="store-card-image-wrapper">
                  <img src={item.image} alt={item.title} className="store-card-image" loading="lazy" />
                </div>

                <div className="store-card-content">
                  <h3 className="store-card-title">{item.title}</h3>
                  <div className="store-card-price">{item.price}</div>

                  <div className="store-card-actions">
                    <button className="btn-details">View Details</button>
                    <button className="btn-buy">Buy Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GraphicDesignStore;
