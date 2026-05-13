import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  ChevronDown, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin,
  BarChart3,
  MousePointer2
} from 'lucide-react';

const THEMES = {
  light: {
    bg: '#FBFBF9',
    text: '#1A1A1A',
    accent: '#C3523E',
    secondary: '#EAEAEA',
    muted: '#666666',
    border: '#D1D1D1',
    cardBg: '#FFFFFF',
    canvasBg: '#FBFBF9',
    canvasLine: 'rgba(0,0,0,0.1)',
    canvasNode: '#C3523E'
  },
  dark: {
    bg: '#0D0D0D',
    text: '#F5F5F5',
    accent: '#FF6B57',
    secondary: '#1A1A1A',
    muted: '#A0A0A0',
    border: '#2A2A2A',
    cardBg: '#141414',
    canvasBg: '#0D0D0D',
    canvasLine: 'rgba(255,255,255,0.1)',
    canvasNode: '#FF6B57'
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
      canvas.height = window.innerHeight * 0.7;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const nodes = [];
    const nodeCount = 12;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 4 + 2,
        phase: Math.random() * Math.PI * 2
      });
    }

    const draw = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const colors = THEMES[theme];
      
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;
        
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        const distToMouse = Math.hypot(node.x - mouseRef.current.x, node.y - mouseRef.current.y);
        if (distToMouse < 200) {
          const angle = Math.atan2(node.y - mouseRef.current.y, node.x - mouseRef.current.x);
          node.x += Math.cos(angle) * 0.2;
          node.y += Math.sin(angle) * 0.2;
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = colors.canvasNode;
        ctx.fill();

        nodes.slice(i + 1).forEach(other => {
          const d = Math.hypot(node.x - other.x, node.y - other.y);
          if (d < 250) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = colors.canvasLine;
            ctx.lineWidth = 1 - d / 250;
            ctx.stroke();
          }
        });
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
        padding: '1rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div style={{ 
          fontSize: '1.5rem', 
          fontWeight: '800', 
          letterSpacing: '-0.05em', 
          color: colors.text, 
          cursor: 'pointer' 
        }}>
          AXON<span style={{ color: colors.accent }}>.</span>STUDIO
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'none', md: 'flex', gap: '2rem' }}>
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
                  fontSize: '0.9rem', 
                  fontWeight: '500', 
                  transition: 'color 0.2s ease',
                  opacity: activeSection === link.href.slice(1) ? 1 : 0.7
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
              padding: '8px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              color: colors.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
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
      
      {isOpen && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          width: '100%', 
          backgroundColor: colors.bg, 
          borderBottom: `1px solid ${colors.border}`,
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          zIndex: 999
        }}>
          {navLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
                setActiveSection(link.href.slice(1));
                document.querySelector(link.href).scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ 
                textDecoration: 'none', 
                color: colors.text, 
                fontSize: '1.2rem', 
                fontWeight: '600' 
              }}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
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
      overflow: 'hidden',
      backgroundColor: colors.bg
    }}>
      <StrategyCanvas theme={theme} />
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        width: '100%', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '4rem', 
        alignItems: 'center',
        zIndex: 10
      }}>
        <div style={{ maxWidth: '600px' }}>
          <div style={{ 
            display: 'inline-block', 
            padding: '6px 12px', 
            borderRadius: '20px', 
            backgroundColor: colors.accent + '15', 
            color: colors.accent, 
            fontSize: '0.8rem', 
            fontWeight: '700', 
            marginBottom: '1.5rem', 
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            Precision Strategy & Design
          </div>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
            lineHeight: '1.1', 
            fontWeight: '800', 
            color: colors.text, 
            marginBottom: '1.5rem',
            letterSpacing: '-0.03em'
          }}>
            Scaling <span style={{ color: colors.accent }}>products</span> through conversion systems.
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: colors.muted, 
            lineHeight: '1.6', 
            marginBottom: '2.5rem',
            maxWidth: '500px'
          }}>
            We partner with high-growth startups to bridge the gap between product vision and market dominance. No fluff, just high-conversion design and rigorous strategy.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#contact" style={{ 
              backgroundColor: colors.accent, 
              color: '#FFF', 
              padding: '1rem 2rem', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              fontWeight: '600', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              transition: 'transform 0.2s ease'
            }} 
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              Start Your Project <ArrowRight size={18} />
            </a>
            <a href="#work" style={{ 
              backgroundColor: 'transparent', 
              color: colors.text, 
              padding: '1rem 2rem', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              fontWeight: '600', 
              border: `1px solid ${colors.border}`,
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              View Case Studies
            </a>
          </div>
        </div>
        <div style={{ 
          position: 'relative', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <div style={{ 
            width: '100%', 
            aspectRatio: '1/1', 
            maxWidth: '500px', 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ 
              width: '80%', 
              height: '80%', 
              border: `2px solid ${colors.accent}`, 
              borderRadius: '24px', 
              position: 'absolute', 
              rotate: '45deg', 
              opacity: 0.2 
            }} />
            <div style={{ 
              width: '60%', 
              height: '60%', 
              border: `2px solid ${colors.text}`, 
              borderRadius: '24px', 
              position: 'absolute', 
              rotate: '-15deg', 
              backgroundColor: colors.cardBg,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              padding: '2rem',
              zIndex: 2
            }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF5F56' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#27C93F' }} />
              </div>
              <div style={{ height: '12px', width: '40%', backgroundColor: colors.secondary, borderRadius: '4px', marginBottom: '1rem' }} />
              <div style={{ height: '8px', width: '100%', backgroundColor: colors.secondary, borderRadius: '4px', marginBottom: '0.5rem' }} />
              <div style={{ height: '8px', width: '80%', backgroundColor: colors.secondary, borderRadius: '4px', marginBottom: '2rem' }} />
              <div style={{ height: '40px', width: '100%', backgroundColor: colors.accent, borderRadius: '6px' }} />
            </div>
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
      desc: 'Defining your market position, user journeys, and growth levers before a single pixel is drawn.', 
      icon: <Target size={32} />, 
      features: ['Competitive Analysis', 'User Persona Mapping', 'Roadmap Planning', 'Value Prop Definition'] 
    },
    { 
      title: 'Launch Design', 
      desc: 'Creating high-impact visual identities and landing pages that turn early interest into active users.', 
      icon: <Zap size={32} />, 
      features: ['Visual Identity', 'Conversion Landing Pages', 'Interactive Prototypes', 'Design Systems'] 
    },
    { 
      title: 'Conversion Systems', 
      desc: 'Continuous optimization of your product funnel using A/B testing and behavioral psychology.', 
      icon: <BarChart3 size={32} />, 
      features: ['Funnel Optimization', 'CRO Audits', 'Onboarding Flows', 'Churn Reduction'] 
    },
  ];

  return (
    <section id="services" style={{ 
      padding: '8rem 2rem', 
      backgroundColor: colors.bg,
      color: colors.text 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '4rem', maxWidth: '700px' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Engineered for <span style={{ color: colors.accent }}>growth</span>.
          </h2>
          <p style={{ fontSize: '1.2rem', color: colors.muted }}>
            We don't just make things look pretty. We build frameworks that drive revenue and user acquisition.
          </p>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          {services.map((s, i) => (
            <div key={i} style={{ 
              padding: '3rem', 
              backgroundColor: colors.cardBg, 
              border: `1px solid ${colors.border}`, 
              borderRadius: '24px', 
              transition: 'all 0.3s ease',
              cursor: 'default'
            }} 
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.accent;
              e.currentTarget.style.transform = 'translateY(-10px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{ color: colors.accent, marginBottom: '1.5rem' }}>{s.icon}</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>{s.title}</h3>
              <p style={{ color: colors.muted, marginBottom: '2rem', lineHeight: '1.6' }}>{s.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {s.features.map((f, j) => (
                  <li key={j} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    marginBottom: '0.75rem', 
                    fontSize: '0.95rem', 
                    color: colors.text 
                  }}>
                    <CheckCircle2 size={16} style={{ color: colors.accent }} /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Work = ({ theme }) => {
  const colors = THEMES[theme];
  const cases = [
    {
      client: 'Nexus AI',
      title: 'Redefining Enterprise LLM Onboarding',
      category: 'Conversion Systems',
      result: '+140% Activation Rate',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      description: 'Implemented a guided a-ha moment framework that reduced time-to-value from 3 days to 15 minutes.'
    },
    {
      client: 'Veloce',
      title: 'High-Velocity Launch Design',
      category: 'Launch Design',
      result: '$2.4M Seed Funding',
      image: 'https://images.unsplash.com/photo-1634017839464-5c339625972a?auto=format&fit=crop&w=800&q=80',
      description: 'Built a visually aggressive brand system and landing page that captured 50k waitlist signups in 2 weeks.'
    },
    {
      client: 'Solis Health',
      title: 'Patient Journey Optimization',
      category: 'Product Strategy',
      result: '-30% Churn Rate',
      image: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80',
      description: 'Re-mapped the entire patient lifecycle, removing high-friction points in the booking flow.'
    }
  ];

  return (
    <section id="work" style={{ padding: '8rem 2rem', backgroundColor: colors.secondary }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
          <div>
            <h2 style={{ fontSize: '3rem', fontWeight: '800', color: colors.text, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              Proven <span style={{ color: colors.accent }}>Outcomes</span>.
            </h2>
            <p style={{ fontSize: '1.2rem', color: colors.muted, maxWidth: '500px' }}>
              We don't ship features; we ship business results. Here is how we do it.
            </p>
          </div>
          <a href="#" style={{ 
            color: colors.text, 
            textDecoration: 'none', 
            fontWeight: '600', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            borderBottom: `2px solid ${colors.accent}`,
            paddingBottom: '4px'
          }}>
            All Projects <ExternalLink size={16} />
          </a>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
          {cases.map((c, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.5rem', 
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ 
                width: '100%', 
                height: '400px', 
                borderRadius: '24px', 
                overflow: 'hidden', 
                position: 'relative',
                backgroundColor: '#EEE'
              }}>
                <img src={c.image} alt={c.client} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{ 
                  position: 'absolute', 
                  top: '1.5rem', 
                  right: '1.5rem', 
                  backgroundColor: colors.accent, 
                  color: '#FFF', 
                  padding: '6px 12px', 
                  borderRadius: '8px', 
                  fontSize: '0.8rem', 
                  fontWeight: '700' 
                }}>
                  {c.result}
                </div>
              </div>
              <div>
                <div style={{ color: colors.accent, fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  {c.category}
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: colors.text, marginBottom: '0.75rem' }}>{c.title}</h3>
                <p style={{ color: colors.muted, lineHeight: '1.6' }}>{c.description}</p>
              </div>
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
      name: 'Sprint', 
      price: '5,000', 
      period: 'fixed', 
      desc: 'Perfect for rapid validation and landing page launches.', 
      features: ['1 High-Conversion Landing Page', 'Product Strategy Session', 'Basic Visual Identity', '2-Week Delivery'],
      highlight: false
    },
    { 
      name: 'Scale', 
      price: '12,000', 
      period: 'fixed', 
      desc: 'Comprehensive design system and full-funnel optimization.', 
      features: ['Complete Design System', 'Full User Journey Mapping', 'Conversion Audit & Implementation', '4-Week Delivery', 'Post-Launch Analysis'],
      highlight: true
    },
    { 
      name: 'Retainer', 
      price: '4,000', 
      period: 'mo', 
      desc: 'Ongoing strategic growth and design partnership.', 
      features: ['Unlimited Design Requests', 'Weekly Strategy Syncs', 'Continuous A/B Testing', 'Priority Support', 'Conversion Monitoring'],
      highlight: false
    },
  ];

  return (
    <section id="pricing" style={{ padding: '8rem 2rem', backgroundColor: colors.bg, color: colors.text }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>Transparent <span style={{ color: colors.accent }}>Investment</span>.</h2>
          <p style={{ fontSize: '1.2rem', color: colors.muted, maxWidth: '600px', margin: '0 auto' }}>
            No hidden fees or hourly billing. We charge for outcomes and value delivered.
          </p>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          alignItems: 'center'
        }}>
          {plans.map((p, i) => (
            <div key={i} style={{ 
              padding: '3rem', 
              borderRadius: '24px', 
              border: p.highlight ? `3px solid ${colors.accent}` : `1px solid ${colors.border}`, 
              backgroundColor: p.highlight ? colors.cardBg : 'transparent',
              position: 'relative',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              {p.highlight && (
                <div style={{ 
                  position: 'absolute', 
                  top: '-15px', 
                  left: '50%', 
                  transform: 'translateX(-50%)', 
                  backgroundColor: colors.accent, 
                  color: '#FFF', 
                  padding: '4px 12px', 
                  borderRadius: '12px', 
                  fontSize: '0.75rem', 
                  fontWeight: '700' 
                }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>{p.name}</h3>
              <p style={{ color: colors.muted, marginBottom: '2rem', fontSize: '0.95rem' }}>{p.desc}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '2rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: '800' }}>${p.price}</span>
                <span style={{ color: colors.muted, fontSize: '1rem' }}>/{p.period === 'mo' ? 'mo' : 'proj'}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0' }}>
                {p.features.map((f, j) => (
                  <li key={j} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    marginBottom: '1rem', 
                    fontSize: '0.95rem' 
                  }}>
                    <CheckCircle2 size={18} style={{ color: colors.accent }} /> {f}
                  </li>
                ))}
              </ul>
              <a href="#contact" style={{ 
                display: 'block', 
                textAlign: 'center', 
                backgroundColor: p.highlight ? colors.accent : colors.secondary, 
                color: p.highlight ? '#FFF' : colors.text, 
                padding: '1rem', 
                borderRadius: '12px', 
                textDecoration: 'none', 
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                Get Started
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = ({ theme }) => {
  const colors = THEMES[theme];
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', project: '', budget: '5k-10k' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" style={{ padding: '8rem 2rem', backgroundColor: colors.bg }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
        <div>
          <h2 style={{ fontSize: '3rem', fontWeight: '800', color: colors.text, marginBottom: '1.5rem' }}>
            Let's build <span style={{ color: colors.accent }}>something</span> significant.
          </h2>
          <p style={{ fontSize: '1.2rem', color: colors.muted, marginBottom: '3rem', lineHeight: '1.6' }}>
            Currently accepting 2 new partners for Q3. If you're scaling a product and need an unfair advantage in design and strategy, reach out.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: colors.text }}>
              <div style={{ backgroundColor: colors.secondary, padding: '12px', borderRadius: '12px', color: colors.accent }}><Mail size={20} /></div>
              <div>hello@axonstudio.design</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: colors.text }}>
              <div style={{ backgroundColor: colors.secondary, padding: '12px', borderRadius: '12px', color: colors.accent }}><Phone size={20} /></div>
              <div>+1 (555) 234-5678</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: colors.text }}>
              <div style={{ backgroundColor: colors.secondary, padding: '12px', borderRadius: '12px', color: colors.accent }}><MapPin size={20} /></div>
              <div>Remote / New York, NY</div>
            </div>
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: colors.cardBg, 
          padding: '3rem', 
          borderRadius: '24px', 
          border: `1px solid ${colors.border}`,
          boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
        }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ color: colors.accent, marginBottom: '1rem' }}><CheckCircle2 size={48} style={{ margin: '0 auto' }} /></div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Message Received!</h3>
              <p style={{ color: colors.muted }}>We'll get back to you within 24 business hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: colors.muted }}>Name</label>
                  <input 
                    required 
                    type="text" 
                    style={{ 
                      padding: '12px', 
                      borderRadius: '8px', 
                      border: `1px solid ${colors.border}`, 
                      backgroundColor: colors.bg, 
                      color: colors.text,
                      outline: 'none'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = colors.accent}
                    onBlur={(e) => e.currentTarget.style.borderColor = colors.border}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: colors.muted }}>Email</label>
                  <input 
                    required 
                    type="email" 
                    style={{ 
                      padding: '12px', 
                      borderRadius: '8px', 
                      border: `1px solid ${colors.border}`, 
                      backgroundColor: colors.bg, 
                      color: colors.text,
                      outline: 'none'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = colors.accent}
                    onBlur={(e) => e.currentTarget.style.borderColor = colors.border}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: colors.muted }}>Project Description</label>
                <textarea 
                  required 
                  rows="4" 
                  style={{ 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: `1px solid ${colors.border}`, 
                    backgroundColor: colors.bg, 
                    color: colors.text,
                    outline: 'none',
                    resize: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = colors.accent}
                  onBlur={(e) => e.currentTarget.style.borderColor = colors.border}
                  onChange={(e) => setFormData({...formData, project: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: colors.muted }}>Estimated Budget</label>
                <select 
                  style={{ 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: `1px solid ${colors.border}`, 
                    backgroundColor: colors.bg, 
                    color: colors.text,
                    outline: 'none'
                  }}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                >
                  <option value="5k-10k">$5,000 - $10,000</option>
                  <option value="10k-20k">$10,000 - $20,000</option>
                  <option value="20k+">$20,000+</option>
                </select>
              </div>
              <button 
                type="submit" 
                style={{ 
                  backgroundColor: colors.accent, 
                  color: '#FFF', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  border: 'none', 
                  fontWeight: '700', 
                  cursor: 'pointer', 
                  fontSize: '1rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                Send Inquiry
              </button>
            </form>
          )}
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
      backgroundColor: colors.secondary, 
      borderTop: `1px solid ${colors.border}`,
      color: colors.text 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.05em' }}>
              AXON<span style={{ color: colors.accent }}>.</span>STUDIO
            </div>
            <p style={{ color: colors.muted, fontSize: '0.9rem', lineHeight: '1.6' }}>
              An independent design studio focusing on the intersection of psychology, design, and growth strategy.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: '700', marginBottom: '1.5rem' }}>Studio</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <a href="#services" style={{ color: colors.muted, textDecoration: 'none' }}>Services</a>
              <a href="#work" style={{ color: colors.muted, textDecoration: 'none' }}>Work</a>
              <a href="#pricing" style={{ color: colors.muted, textDecoration: 'none' }}>Pricing</a>
              <a href="#contact" style={{ color: colors.muted, textDecoration: 'none' }}>Contact</a>
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: '700', marginBottom: '1.5rem' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <a href="#" style={{ color: colors.muted, textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#" style={{ color: colors.muted, textDecoration: 'none' }}>Terms of Service</a>
              <a href="#" style={{ color: colors.muted, textDecoration: 'none' }}>Cookie Policy</a>
            </div>
          </div>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          paddingTop: '3rem', 
          borderTop: `1px solid ${colors.border}`,
          fontSize: '0.85rem',
          color: colors.muted
        }}>
          <div>© {new Date().getFullYear()} Axon Studio. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: colors.muted, textDecoration: 'none' }}>Twitter</a>
            <a href="#" style={{ color: colors.muted, textDecoration: 'none' }}>LinkedIn</a>
            <a href="#" style={{ color: colors.muted, textDecoration: 'none' }}>Dribbble</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function StudioWebsite() {
  const [theme, setTheme] = useState('light');
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const savedTheme = localStorage.getItem('studio-theme');
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('studio-theme', newTheme);
  };

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
      scrollBehavior: 'smooth'
    }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          body { margin: 0; padding: 0; overflow-x: hidden; }
          * { box-sizing: border-box; }
          html { scroll-behavior: smooth; }
          @media (max-width: 768px) {
            .md-hidden { display: none !important; }
            .md-flex { display: flex !important; }
          }
        `}
      </style>
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      <Hero theme={theme} />
      <Services theme={theme} />
      <Work theme={theme} />
      <Pricing theme={theme} />
      <Contact theme={theme} />
      <Footer theme={theme} />
    </div>
  );
}