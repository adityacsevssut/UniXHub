import React from 'react';
import Navbar from '../../components/Navbar';
import GraphicDesignDeveloperPanel from './GraphicDesignDeveloperPanel';
import './GraphicDesignAdmin.css'; // Retaining for page layout if needed, though most is now in the component

const GraphicDesignAdmin = () => {
  return (
    <div className="admin-page-wrapper">
      <Navbar />
      <div className="admin-page-container" style={{ paddingTop: '100px', minHeight: '100vh', background: '#f0f4f8', paddingBottom: '50px' }}>

        {/* We can put a header here if we want, or rely on the panel's header */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 className="text-3xl font-bold text-slate-800">Developer Dashboard</h1>
            <p className="text-slate-500">Manage all your application settings</p>
          </div>

          {/* This is the "Card" component we just created */}
          <GraphicDesignDeveloperPanel />

        </div>
      </div>
    </div>
  );
};

export default GraphicDesignAdmin;
