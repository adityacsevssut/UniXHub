import React from 'react';
import { Layout, Palette, Code, Layers, FileText, Server, Monitor, Globe, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Domains.css';

const domains = [
  {
    title: 'Graphic Design',
    icon: <Palette size={28} />,
    description: 'Design Your Logos and Create Branding, Social Media Posts, and Banners for Your Business.',
    tags: ['Branding', 'UI/UX', 'Social Media'],
    color: '#ec4899',
    path: '/graphic-design'
  },
  {
    title: 'FrontEnd Development',
    icon: <Layout size={28} />,
    description: 'We build responsive and user-friendly website interfaces.',
    tags: ['React', 'Tailwind', 'Motion'],
    color: '#3b82f6'
  },
  {
    title: 'Full Stack Websites',
    icon: <Layers size={28} />,
    description: 'Built Your Own Complex Web Applications With Robust Backend Systems.',
    tags: ['MERN', 'Next.js', 'API'],
    color: '#8b5cf6'
  },
  {
    title: 'Written Contents',
    icon: <Globe size={28} />,
    description: 'Neatly Written Academic Contents, Charts and Creative Works.',
    tags: ['Personal', 'Resume', 'Blog'],
    color: '#10b981'
  },
  {
    title: 'Project Desk',
    icon: <FileText size={28} />,
    description: 'We Provide Innovative Project Ideas, UI References, and Ready Reports and PPTs to Support Your Academic Assessments.',
    tags: ['Docs', 'PPT', 'Reports'],
    color: '#f59e0b'
  },
  {
    title: 'Career Docs',
    icon: <Monitor size={28} />,
    description: 'We Create Resumes, CVs, Cover Letters, and Optimize LinkedIn and GitHub profiles.',
    tags: ['Events', 'E-com', 'Landing'],
    color: '#06b6d4'
  },
];

const DomainCard = ({ title, icon, description, tags, color, isVisible, path }) => {
  const navigate = useNavigate();

  const handleExplore = (e) => {
    e.stopPropagation();
    if (path) {
      navigate(path);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div
      className={`domain-card ${isVisible ? 'in-view' : ''}`}
      style={{
        '--card-bg': `${color}dd`,
        '--card-hover-bg': '#f8fafc'
      }}
    >
      <h3 className="domain-card-title-default">{title}</h3>

      <div className="top-right-arrow">
        <ArrowRight size={32} strokeWidth={2.5} />
      </div>

      <div className="domain-card-overlay-top">
        <ArrowRight size={24} color={color} />
      </div>

      <div className="domain-card-overlay-bottom">
        <div className="hover-icon-wrapper">
          {React.cloneElement(icon, { size: 32 })}
        </div>

        <div className="hover-content">
          <p className="domain-desc-hover">{description}</p>

          <button className="domain-btn-hover" onClick={handleExplore}>
            Explore
            <svg viewBox="0 0 16 19" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z" />
            </svg>
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
        threshold: 0.1,
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
          <h2 className="section-title">
            OUR <span className="text-gradient">PROFESSIONAL SERVICES</span>
          </h2>
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
