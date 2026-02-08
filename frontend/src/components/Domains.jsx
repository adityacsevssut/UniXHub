import React from 'react';
import { Layout, Palette, Code, Layers, FileText, Server, Monitor, Globe, CheckCircle, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Domains.css';



const DomainCard = ({ title, icon, description, tags, color, isVisible, path }) => {
  const navigate = useNavigate();

  const handleExplore = () => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className={`domain-card glass-card ${isVisible ? 'in-view' : ''}`}>
      <div className="card-header centered-header">
        <div className="domain-icon-wrapper" style={{
          backgroundColor: `${color}10`,
          borderColor: `${color}30`,
          color: color
        }}>
          {icon}
        </div>
      </div>

      <div className="domain-content centered-content">
        <h3 className="domain-title">{title}</h3>
        <p className="domain-desc">{description}</p>
        <button className="domain-explore-btn" onClick={handleExplore}>
          Explore <ArrowUpRight size={18} />
        </button>
      </div>
    </div>
  );
};

const Domains = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [services, setServices] = React.useState([]);
  const sectionRef = React.useRef(null);

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (services.length === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '50px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [services]);

  // Helper to map icon string to component
  const getIcon = (iconName) => {
    const iconProps = { size: 28 };
    switch (iconName) {
      case 'Palette': return <Palette {...iconProps} />;
      case 'Layout': return <Layout {...iconProps} />;
      case 'Layers': return <Layers {...iconProps} />;
      case 'Globe': return <Globe {...iconProps} />;
      case 'FileText': return <FileText {...iconProps} />;
      case 'Monitor': return <Monitor {...iconProps} />;
      case 'Code': return <Code {...iconProps} />;
      case 'Server': return <Server {...iconProps} />;
      default: return <Code {...iconProps} />;
    }
  };

  return (
    <section className="domains-section section-padding" id="domains" ref={sectionRef}>
      <div className="container">
        <div className="section-header centered-header-text">
          <h2 className="section-title">OUR <span className="text-gradient">PROFESSIONAL SERVICES</span></h2>
        </div>

        <div className="domains-grid">
          {services.map((service, index) => (
            <DomainCard
              key={service._id}
              title={service.title}
              description={service.description}
              color={service.color}
              icon={getIcon(service.iconName)}
              tags={service.tags}
              path={service.path}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Domains;
