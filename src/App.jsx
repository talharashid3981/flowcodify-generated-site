import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Target, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  ChevronRight, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin,
  BarChart3,
  MousePointer2,
  ArrowUpRight,
  Globe,
  Cpu,
  Smartphone,
  Star,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

const THEMES = {
  light: {
    bg: '#FDFBFA',
    text: '#1A1A1A',
    accent: '#B8860B',
    secondary: '#F2EEE9',
    muted: '#6B6B6B',
    border: '#E8E4DE',
    cardBg: '#FFFFFF',
    canvasBg: '#FDFBFA',
    canvasLine: 'rgba(184, 134, 11, 0.15)',
    canvasNode: '#B8860B'
  },
  dark: {
    bg: '#0F110F',
    text: '#F5F5F5',
    accent: '#E6B800',
    secondary: '#1A1D1A',
    muted: '#A0A0A0',
    border: '#2A2E2A',
    cardBg: '#161916',
    canvasBg: '#0F110F',
    canvasLine: 'rgba(230, 184, 0, 0.2)',
    canvasNode: '#E6B800'
  }
};

const StrategyCanvas = ({ theme }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.8;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const nodes = [];
    const nodeCount = 40;
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        phase: Math.random() * Math.PI * 2
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const colors = THEMES[theme];
      
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < 200) {
          const force = (200 - dist) / 200;
          node.x -= dx * force * 0.02;
          node.y -= dy * force * 0.02;
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = colors.canvasNode;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const d = Math.hypot(node.x - other.x, node.y - other.y);
          if (d < 150) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = colors.canvasLine;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas 
      ref={canvasRef} 
      onMouseMove={(e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }}
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1,
        pointerEvents: 'all',
        opacity: 0.6
      }} 
    />
  );
};

const Navbar = ({ theme, toggleTheme, activeSection, setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const colors = THEMES[theme];
  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Work', href: '#work' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav style={{ 
      position: 'fixed', 
      top: 0, 
      width: '100%', 
      zIndex: 1000, 
      backgroundColor: colors.bg + 'CC', 
      backdropFilter: 'blur(12px)', 
      borderBottom: `1px solid ${colors.border}`,
      transition: 'all 0.3s ease'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '1.25rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div style={{ 
          fontSize: '1.4rem', 
          fontWeight: '800', 
          letterSpacing: '-0.04em', 
          color: colors.text, 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          AXON<span style={{ color: colors.accent }}>.</span>STUDIO
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'none', md: 'flex', gap: '2.5rem' }}>
            {navLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection(link.href.slice(1));
                  document.querySelector(link.href).scrollIntoView({ behavior: 'smooth' });
                }}
                style={{ 
                  textDecoration: 'none', 
                  color: activeSection === link.href.slice(1) ? colors.accent : colors.text, 
                  fontSize: '0.85rem', 
                  fontWeight: '600', 
                  transition: 'all 0.2s ease',
                  opacity: activeSection === link.href.slice(1) ? 1 : 0.6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {link.name}
              </a>
            ))}
          </div>
          <button 
            onClick={toggleTheme} 
            style={{ 
              background: 'none', 
              border: `1px solid ${colors.border}`, 
              padding: '0.5rem', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              color: colors.text, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button 
            style={{ 
              backgroundColor: colors.text, 
              color: colors.bg, 
              border: 'none', 
              padding: '0.6rem 1.2rem', 
              borderRadius: '6px', 
              fontWeight: '600', 
              fontSize: '0.85rem', 
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Start a Project
          </button>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            style={{ 
              display: 'none', 
              md: 'none', 
              background: 'none', 
              border: 'none', 
              color: colors.text, 
              cursor: 'pointer' 
            }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

const Hero = ({ theme }) => {
  const colors = THEMES[theme];
  return (
    <section style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      padding: '0 2rem', 
      paddingTop: '80px',
      overflow: 'hidden'
    }}>
      <StrategyCanvas theme={theme} />
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        width: '100%', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(12, 1fr)', 
        gap: '2rem', 
        alignItems: 'center' 
      }}>
        <div style={{ gridColumn: 'span 7' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            backgroundColor: colors.secondary, 
            padding: '0.4rem 0.8rem', 
            borderRadius: '20px', 
            fontSize: '0.75rem', 
            fontWeight: '700', 
            color: colors.accent, 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em', 
            marginBottom: '1.5rem' 
          }}>
            <Zap size={12} /> Independent Design Studio
          </div>
          <h1 style={{ 
            fontSize: 'clamp(3rem, 8vw, 5rem)', 
            lineHeight: '1.1', 
            fontWeight: '800', 
            color: colors.text, 
            letterSpacing: '-0.03em', 
            marginBottom: '2rem' 
          }}>
            Engineering <span style={{ color: colors.accent }}>Conversion</span> Through Strategy.
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            lineHeight: '1.6', 
            color: colors.muted, 
            maxWidth: '600px', 
            marginBottom: '3rem' 
          }}>
            We help high-growth startups define their product strategy, design their launch identity, and build systems that convert users into advocates.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <button style={{ 
              backgroundColor: colors.accent, 
              color: '#FFF', 
              border: 'none', 
              padding: '1rem 2rem', 
              borderRadius: '8px', 
              fontSize: '1rem', 
              fontWeight: '600', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              transition: 'transform 0.2s ease'
            }} 
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              View Our Work <ArrowRight size={20} />
            </button>
            <button style={{ 
              backgroundColor: 'transparent', 
              color: colors.text, 
              border: `1px solid ${colors.border}`, 
              padding: '1rem 2rem', 
              borderRadius: '8px', 
              fontSize: '1rem', 
              fontWeight: '600', 
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Our Process
            </button>
          </div>
        </div>
        <div style={{ 
          gridColumn: 'span 5', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2rem', 
          position: 'relative' 
        }}>
          <div style={{ 
            backgroundColor: colors.cardBg, 
            border: `1px solid ${colors.border}`, 
            padding: '2rem', 
            borderRadius: '24px', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.05)', 
            transform: 'rotate(-2deg)', 
            transition: 'transform 0.3s ease' 
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(0deg) scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(-2deg) scale(1)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.5rem', backgroundColor: colors.secondary, borderRadius: '8px', color: colors.accent }}>
                <BarChart3 size={20} />
              </div>
              <span style={{ fontWeight: '700', color: colors.text }}>Conversion Metric</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: colors.text }}>+142%</div>
            <div style={{ fontSize: '0.875rem', color: colors.muted }}>Avg. growth for launch clients</div>
          </div>
          <div style={{ 
            backgroundColor: colors.cardBg, 
            border: `1px solid ${colors.border}`, 
            padding: '2rem', 
            borderRadius: '24px', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.05)', 
            transform: 'rotate(3deg)', 
            marginTop: '-2rem',
            marginLeft: '2rem',
            transition: 'transform 0.3s ease' 
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(0deg) scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(3deg) scale(1)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.5rem', backgroundColor: colors.secondary, borderRadius: '8px', color: colors.accent }}>
                <Target size={20} />
              </div>
              <span style={{ fontWeight: '700', color: colors.text }}>Market Fit</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: colors.text }}>98%</div>
            <div style={{ fontSize: '0.875rem', color: colors.muted }}>Product-market alignment rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Services = ({ theme }) => {
  const colors = THEMES[theme];
  const services = [
    {
      title: 'Product Strategy',
      description: 'We map your product ecosystem, identify friction points, and define the North Star metric that drives sustainable growth.',
      icon: <Layers size={32} />,
      features: ['User Journey Mapping', 'Competitive Analysis', 'Value Proposition Design', 'GTM Strategy'],
      outcome: 'A validated roadmap for scale.'
    },
    {
      title: 'Launch Design',
      description: 'First impressions are everything. We create a high-impact visual identity and landing experience that commands attention.',
      icon: <Zap size={32} />,
      features: ['Visual Identity', 'High-Conversion Landing Pages', 'Brand Guidelines', 'Interactive Prototyping'],
      outcome: 'A launch that converts on day one.'
    },
    {
      title: 'Conversion Systems',
      description: 'Optimization is a science. We implement A/B testing, funnel analytics, and UX refinements to maximize your LTV.',
      icon: <TrendingUp size={32} />,
      features: ['Conversion Rate Optimization', 'Funnel Audits', 'User Behavior Analysis', 'Retention Systems'],
      outcome: 'Maximum efficiency per visitor.'
    }
  ];

  return (
    <section id="services" style={{ 
      padding: '8rem 2rem', 
      backgroundColor: colors.bg, 
      color: colors.text 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: '600px' }}>
            <span style={{ color: colors.accent, fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em' }}>Our Expertise</span>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', marginTop: '1rem', letterSpacing: '-0.02em' }}>
              Strategic Design for Modern Scale.
            </h2>
          </div>
          <p style={{ maxWidth: '400px', color: colors.muted, fontSize: '1.1rem', lineHeight: '1.6' }}>
            We don't just make things look pretty. We build digital assets that act as revenue drivers for your business.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2rem' 
        }}>
          {services.map((service, idx) => (
            <div key={idx} style={{ 
              backgroundColor: colors.cardBg, 
              border: `1px solid ${colors.border}`, 
              padding: '3rem', 
              borderRadius: '24px', 
              transition: 'all 0.3s ease',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.accent;
              e.currentTarget.style.transform = 'translateY(-10px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{ color: colors.accent, marginBottom: '2rem' }}>{service.icon}</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>{service.title}</h3>
              <p style={{ color: colors.muted, lineHeight: '1.6', marginBottom: '2rem' }}>{service.description}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {service.features.map((feat, fIdx) => (
                  <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                    <CheckCircle2 size={16} color={colors.accent} /> {feat}
                  </div>
                ))}
              </div>
              <div style={{ 
                paddingTop: '2rem', 
                borderTop: `1px solid ${colors.border}`, 
                fontSize: '0.875rem', 
                fontWeight: '700', 
                color: colors.text,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ color: colors.accent }}>Outcome:</span> {service.outcome}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Work = ({ theme }) => {
  const colors = THEMES[theme];
  const projects = [
    {
      title: 'Lumina FinTech',
      category: 'Launch Design & Strategy',
      description: 'Redefining the wealth management experience for Gen-Z investors.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
      metrics: '200% increase in sign-ups'
    },
    {
      title: 'Apex Health',
      category: 'Conversion Systems',
      description: 'Scaling a telemedicine platform through rigorous funnel optimization.',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
      metrics: '42% reduction in churn'
    },
    {
      title: 'Nova AI',
      category: 'Product Strategy',
      description: 'Positioning an LLM-based productivity tool in a crowded market.',
      image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800',
      metrics: '1M+ users in 3 months'
    }
  ];

  return (
    <section id="work" style={{ 
      padding: '8rem 2rem', 
      backgroundColor: colors.secondary, 
      color: colors.text 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '4rem' }}>
          <span style={{ color: colors.accent, fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em' }}>Case Studies</span>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', marginTop: '1rem', letterSpacing: '-0.02em' }}>
            Proven Impact. Real Results.
          </h2>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '3rem' 
        }}>
          {projects.map((project, idx) => (
            <div key={idx} style={{ 
              cursor: 'pointer', 
              group: 'true',
              transition: 'all 0.3s ease' 
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ 
                position: 'relative', 
                borderRadius: '24px', 
                overflow: 'hidden', 
                aspectRatio: '4/5', 
                marginBottom: '1.5rem',
                backgroundColor: colors.border
              }}>
                <img 
                  src={project.image} 
                  alt={project.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{ 
                  position: 'absolute', 
                  bottom: '1.5rem', 
                  left: '1.5rem', 
                  backgroundColor: colors.cardBg, 
                  padding: '0.75rem 1rem', 
                  borderRadius: '12px', 
                  fontSize: '0.875rem', 
                  fontWeight: '700', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)' 
                }}>
                  <TrendingUp size={16} color={colors.accent} /> {project.metrics}
                </div>
              </div>
              <span style={{ color: colors.accent, fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>{project.category}</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0.5rem 0 1rem 0' }}>{project.title}</h3>
              <p style={{ color: colors.muted, lineHeight: '1.6', marginBottom: '1.5rem' }}>{project.description}</p>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                fontWeight: '700', 
                fontSize: '0.9rem', 
                color: colors.text,
                transition: 'gap 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.gap = '0.75rem'}
              onMouseLeave={(e) => e.currentTarget.style.gap = '0.5rem'}
              >
                View Case Study <ArrowUpRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Process = ({ theme }) => {
  const colors = THEMES[theme];
  const steps = [
    {
      step: '01',
      title: 'The Audit',
      description: 'We deep-dive into your current product metrics, user feedback, and competitive landscape to find the "leaks" in your conversion funnel.',
      icon: <Target size={24} />
    },
    {
      step: '02',
      title: 'The Strategy',
      description: 'We map out a high-resolution roadmap. Not just a list of features, but a sequence of experiments designed to move the needle.',
      icon: <Layers size={24} />
    },
    {
      step: '03',
      title: 'The Execution',
      description: 'We build and launch the identity and interfaces. We focus on high-fidelity design that balances beauty with brutal efficiency.',
      icon: <Zap size={24} />
    },
    {
      step: '04',
      title: 'The Optimization',
      description: 'Launch is just the start. We monitor, test, and refine the system based on real-world user data until the target KPI is met.',
      icon: <TrendingUp size={24} />
    }
  ];

  return (
    <section style={{ 
      padding: '8rem 2rem', 
      backgroundColor: colors.bg, 
      color: colors.text 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <span style={{ color: colors.accent, fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em' }}>Methodology</span>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', marginTop: '1rem', letterSpacing: '-0.02em' }}>
            From Chaos to Conversion.
          </h2>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem', 
          position: 'relative' 
        }}>
          {steps.map((step, idx) => (
            <div key={idx} style={{ 
              padding: '2rem', 
              position: 'relative',
              borderLeft: `2px solid ${colors.border}`,
              paddingLeft: '3rem'
            }}>
              <div style={{ 
                position: 'absolute', 
                left: '-14px', 
                top: '0', 
                width: '26px', 
                height: '26px', 
                borderRadius: '50%', 
                backgroundColor: colors.bg, 
                border: `2px solid ${colors.accent}`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: colors.accent, 
                fontWeight: '700', 
                fontSize: '0.75rem' 
              }}>
                {step.step}
              </div>
              <div style={{ color: colors.accent, marginBottom: '1rem' }}>{step.icon}</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>{step.title}</h3>
              <p style={{ color: colors.muted, lineHeight: '1.6' }}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = ({ theme }) => {
  const colors = THEMES[theme];
  const plans = [
    {
      name: 'Strategy Sprint',
      price: '4,500',
      period: '/project',
      description: 'Ideal for early-stage startups needing a clear direction and validated roadmap.',
      features: ['Market Analysis', 'User Personas', 'GTM Roadmap', 'Value Prop Definition', '1 Week Turnaround'],
      recommended: false,
      buttonText: 'Book a Sprint'
    },
    {
      name: 'Launch Engine',
      price: '12,000',
      period: '/project',
      description: 'A complete design and strategy package to launch your product with maximum impact.',
      features: ['Everything in Strategy', 'Full Visual Identity', 'Conversion Landing Page', 'Pitch Deck Design', 'Launch Asset Kit'],
      recommended: true,
      buttonText: 'Get Launched'
    },
    {
      name: 'Growth System',
      price: '3,000',
      period: '/month',
      description: 'Ongoing optimization and design support to scale your product conversion rates.',
      features: ['Everything in Launch', 'Weekly A/B Testing', 'Conversion Audit', 'UX Refinements', 'Monthly Growth Report'],
      recommended: false,
      buttonText: 'Scale Now'
    }
  ];

  return (
    <section id="pricing" style={{ 
      padding: '8rem 2rem', 
      backgroundColor: colors.secondary, 
      color: colors.text 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span style={{ color: colors.accent, fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em' }}>Investment</span>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', marginTop: '1rem', letterSpacing: '-0.02em' }}>
            Transparent Pricing.
          </h2>
          <p style={{ color: colors.muted, maxWidth: '600px', margin: '1.5rem auto', lineHeight: '1.6' }}>
            We offer fixed-price packages to eliminate uncertainty. No hidden fees, just high-impact results.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem', 
          alignItems: 'center' 
        }}>
          {plans.map((plan, idx) => (
            <div key={idx} style={{ 
              backgroundColor: plan.recommended ? colors.cardBg : 'transparent', 
              border: `2px solid ${plan.recommended ? colors.accent : colors.border}`, 
              padding: '3rem', 
              borderRadius: '32px', 
              position: 'relative',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {plan.recommended && (
                <div style={{ 
                  position: 'absolute', 
                  top: '-15px', 
                  left: '50%', 
                  transform: 'translateX(-50%)', 
                  backgroundColor: colors.accent, 
                  color: '#FFF', 
                  padding: '0.4rem 1rem', 
                  borderRadius: '20px', 
                  fontSize: '0.75rem', 
                  fontWeight: '800', 
                  textTransform: 'uppercase' 
                }}>
                  Most Popular
                </div>
              )}
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>{plan.name}</h3>
              <p style={{ color: colors.muted, fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.5' }}>{plan.description}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '2rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: '800' }}>${plan.price}</span>
                <span style={{ color: colors.muted, fontWeight: '500' }}>{plan.period}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                {plan.features.map((feat, fIdx) => (
                  <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', fontWeight: '500' }}>
                    <CheckCircle2 size={18} color={colors.accent} /> {feat}
                  </div>
                ))}
              </div>
              <button style={{ 
                width: '100%', 
                padding: '1rem', 
                borderRadius: '12px', 
                fontWeight: '700', 
                cursor: 'pointer', 
                transition: 'all 0.2s ease',
                backgroundColor: plan.recommended ? colors.accent : colors.text, 
                color: plan.recommended ? '#FFF' : colors.bg, 
                border: 'none' 
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = ({ theme }) => {
  const colors = THEMES[theme];
  const [formState, setFormState] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => setFormState('success'), 1500);
  };

  return (
    <section id="contact" style={{ 
      padding: '8rem 2rem', 
      backgroundColor: colors.bg, 
      color: colors.text 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '4rem' 
        }}>
          <div>
            <span style={{ color: colors.accent, fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em' }}>Connect</span>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', marginTop: '1rem', letterSpacing: '-0.02em', marginBottom: '2rem' }}>
              Ready to Scale Your Product?
            </h2>
            <p style={{ color: colors.muted, fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '3rem' }}>
              We only take on 2 new clients per month to ensure every project receives our full strategic attention.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: colors.secondary, borderRadius: '12px', color: colors.accent }}>
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: colors.muted, fontWeight: '600' }}>Email Us</div>
                  <div style={{ fontWeight: '600' }}>hello@axonstudio.design</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: colors.secondary, borderRadius: '12px', color: colors.accent }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: colors.muted, fontWeight: '600' }}>Location</div>
                  <div style={{ fontWeight: '600' }}>Remote / London / NYC</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: colors.cardBg, 
            border: `1px solid ${colors.border}`, 
            padding: '3rem', 
            borderRadius: '32px', 
            boxShadow: '0 30px 60px rgba(0,0,0,0.05)' 
          }}>
            {formState === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ color: colors.accent, marginBottom: '1rem' }}>
                  <CheckCircle2 size={64} style={{ margin: '0 auto' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>Message Received!</h3>
                <p style={{ color: colors.muted }}>We'll review your details and get back to you within 48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>Name</label>
                    <input 
                      required 
                      type="text" 
                      style={{ 
                        padding: '0.8rem', 
                        borderRadius: '8px', 
                        border: `1px solid ${colors.border}`, 
                        backgroundColor: colors.bg, 
                        color: colors.text 
                      }} 
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>Email</label>
                    <input 
                      required 
                      type="email" 
                      style={{ 
                        padding: '0.8rem', 
                        borderRadius: '8px', 
                        border: `1px solid ${colors.border}`, 
                        backgroundColor: colors.bg, 
                        color: colors.text 
                      }} 
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>Service Interested In</label>
                  <select 
                    style={{ 
                      padding: '0.8rem', 
                      borderRadius: '8px', 
                      border: `1px solid ${colors.border}`, 
                      backgroundColor: colors.bg, 
                      color: colors.text 
                    }}
                  >
                    <option>Product Strategy</option>
                    <option>Launch Design</option>
                    <option>Conversion Systems</option>
                    <option>Custom Package</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>Project Details</label>
                  <textarea 
                    required 
                    rows="4" 
                    style={{ 
                      padding: '0.8rem', 
                      borderRadius: '8px', 
                      border: `1px solid ${colors.border}`, 
                      backgroundColor: colors.bg, 
                      color: colors.text, 
                      resize: 'none' 
                    }} 
                  />
                </div>
                <button 
                  disabled={formState === 'submitting'}
                  style={{ 
                    backgroundColor: colors.accent, 
                    color: '#FFF', 
                    border: 'none', 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    fontSize: '1rem', 
                    fontWeight: '700', 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  {formState === 'submitting' ? 'Sending...' : 'Send Request'} <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ theme }) => {
  const colors = THEMES[theme];
  return (
    <footer style={{ 
      padding: '4rem 2rem', 
      backgroundColor: colors.cardBg, 
      borderTop: `1px solid ${colors.border}`, 
      color: colors.text 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        <div style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.04em' }}>
          AXON<span style={{ color: colors.accent }}>.</span>STUDIO
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', fontWeight: '500', color: colors.muted }}>
          <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Twitter</a>
          <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Dribbble</a>
          <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>LinkedIn</a>
          <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Instagram</a>
        </div>
        <div style={{ fontSize: '0.875rem', color: colors.muted }}>
          © {new Date().getFullYear()} Axon Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['services', 'work', 'pricing', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ 
      backgroundColor: THEMES[theme].bg, 
      color: THEMES[theme].text, 
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif', 
      transition: 'background-color 0.3s ease, color 0.3s ease',
      minHeight: '100vh'
    }}>
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      <Hero theme={theme} />
      <Services theme={theme} />
      <Work theme={theme} />
      <Process theme={theme} />
      <Pricing theme={theme} />
      <Contact theme={theme} />
      <Footer theme={theme} />
    </div>
  );
}