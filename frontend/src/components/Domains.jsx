import React from 'react';
import { Layout, Palette, Code, Layers, FileText, Server, Monitor, Globe, CheckCircle, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Domains.css';

const domains = [
  {
    title: 'Graphic Design',
    icon: <Palette size={28} />,
    description: 'Design Your Logos and Create Branding, Social Media Posts, and Banners for Your Business.',
    tags: ['Branding', 'UI/UX', 'Social Media'],
    color: '#ec4899', // Pink
    path: '/graphic-design'
  },
  {
    title: 'FrontEnd Development',
    icon: <Layout size={28} />,
    description: 'We build responsive and user-friendly website interfaces.',
    tags: ['React', 'Tailwind', 'Motion'],
    color: '#3b82f6' // Blue
  },
  {
    title: 'Full Stack Websites',
    icon: <Layers size={28} />,
    description: 'Built Your Own Complex Web Applications With Robust Backend Systems.',
    tags: ['MERN', 'Next.js', 'API'],
    color: '#8b5cf6' // Violet
  },
  {
    title: 'Written Contents',
    icon: <Globe size={28} />,
    description: 'Neatly Written Academic Contents , Charts and Creative Works.',
    tags: ['Personal', 'Resume', 'Blog'],
    color: '#10b981' // Green
  },
  {
    title: 'Project Desk',
    icon: <FileText size={28} />,
    description: 'We Provide Innovative Project Ideas, UI References, and Ready Reports and PPTs to Support Your Academic Assessments.',
    tags: ['Docs', 'PPT', 'Reports'],
    color: '#f59e0b' // Amber
  },
  {
    title: 'Career Docs',
    icon: <Monitor size={28} />,
    description: 'We Create Resumes, CVs, and Cover Letters, and Optimize your LinkedIn and GitHub profiles.',
    tags: ['Events', 'E-com', 'Landing'],
    color: '#06b6d4' // Cyan
  },
];


const DomainCard = ({ title, icon, description, tags, color, isVisible, path }) => {
  const navigate = useNavigate();

  const handleExplore = (e) => {
    e.stopPropagation(); // Prevent bubbling if card itself becomes clickable later
    if (path) {
      navigate(path);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div 
      className={`domain-card ${isVisible ? 'in-view' : ''}`}
      style={{ 
        '--card-bg': `${color}dd`, // Adjusted alpha for "slight lighter" effect
        '--card-hover-bg': '#f8fafc' // Very light slate for contrast
      }}
    >
      {/* Default State: Title only */}
      <h3 className="domain-card-title-default">{title}</h3>

      {/* Hover State: Top Right Overlay (Background effect) */}
      <div className="domain-card-overlay-top"></div>

      {/* Hover State: Bottom Left Overlay (Content holder) */}
      <div className="domain-card-overlay-bottom">
        {/* Icon positioned Top Left in Hover state */}
        <div className="hover-icon-wrapper">
          {React.cloneElement(icon, { size: 32 })}
        </div>

        <div className="hover-content">
          <p className="domain-desc-hover">{description}</p>
          <button className="domain-btn-hover" onClick={handleExplore}>
            Explore <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Domains = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const sectionRef = React.useRef(null);

  React.useEffect(() => {
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
  }, []);

  return (
    <section className="domains-section section-padding" id="domains" ref={sectionRef}>
      <div className="container">
        <div className="section-header centered-header-text">
          <h2 className="section-title">OUR <span className="text-gradient">PROFESSIONAL SERVICES</span></h2>
        </div>

        <div className="domains-grid">
          {domains.map((domain, index) => (
            <DomainCard key={index} {...domain} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Domains;
