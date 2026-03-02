import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Home.css";

const labsPreview = [
  {
    title: "Sorting Algorithms Lab",
    description:
      "Experiment with and visualize classic sorting algorithms. Understand their step-by-step process and compare their efficiency.",
    icon: "🔢",
    features: [
      "Bubble, Selection, Insertion, Merge, Quick Sort"
    ],
    link: "/labs/dsa"
  }
];

function getFeatures(instituteMode) {
  const base = [
    {
      title: "Structured Experiments",
      description:
        "Well-defined laboratory experiments designed according to academic curricula.",
      icon: "📘"
    },
    {
      title: "AI Learning Assistant",
      description:
        "Intelligent guidance for concept clarification, performance analysis, and exam preparation.",
      icon: "🤖"
    },
    {
      title: "Progress Tracking",
      description:
        "Monitor learning progress, quiz performance, and experiment completion.",
      icon: "📈"
    }
  ];
  if (!instituteMode) {
    base.push({
      title: "Experimental Features",
      description: "Try new AI-powered tools and beta lab modules.",
      icon: "🧪"
    });
  }
  return base;
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const Home = ({ instituteMode = false }) => {
  const features = getFeatures(instituteMode);
  return (
    <div className="home-container">
      {/* ================= HERO SECTION ================= */}
      <header className="home-hero">
        <div className="hero-maxwidth">
          <motion.div
            className="hero-box"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="hero-inner">
              <span className="hero-badge">Welcome To SimuLab</span>
              <h1 className="hero-title" style={{marginTop: '0.5rem', marginBottom: '0.7rem'}}>
                <span className="gradient-text">SimuLab: Virtual Lab</span>
              </h1>
              <p className="hero-description" style={{fontSize: '1.18rem', fontWeight: 500, marginBottom: '2.2rem'}}>
                Develop strong problem-solving skills through structured experiments and guided practice in sorting algorithms.
              </p>
              <div className="home-buttons" style={{display: 'flex', gap: '1.2rem', justifyContent: 'center'}}>
                <Link to="/labs/dsa" className="btn primary" style={{minWidth: 160, fontWeight: 600, fontSize: '1.08rem'}}>
                  Explore Lab <span className="btn-icon">→</span>
                </Link>
                <Link to="/register" className="btn secondary" style={{minWidth: 160, fontWeight: 600, fontSize: '1.08rem'}}>
                  Create Account
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </header>
      {/* ================= FEATURES SECTION ================= */}
      <section className="features-section">
        <div className="features-maxwidth">
          <motion.h2 {...fadeUp} className="features-title" style={{textAlign: 'center', marginBottom: '2.2rem', fontWeight: 700, fontSize: '2.1rem', letterSpacing: '-0.01em'}}>Why Choose SimuLab?</motion.h2>
          <div className="features-grid">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                {...fadeUp}
                transition={{ delay: idx * 0.1 }}
                style={{display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 180, boxShadow: 'var(--shadow-card)', borderRadius: 'var(--radius-md)', background: 'linear-gradient(180deg, var(--bg-panel-soft), var(--bg-panel))'}}>
                <span className="feature-icon" style={{fontSize: '2.2rem', marginBottom: 12}}>{feature.icon}</span>
                <h3 className="feature-heading" style={{fontWeight: 600, fontSize: '1.13rem', marginBottom: 6}}>{feature.title}</h3>
                <p className="feature-desc" style={{textAlign: 'center', fontSize: '0.98rem', color: 'var(--text-muted)'}}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* ================= LABS PREVIEW ================= */}
      <section className="labs-preview">
        <div className="labs-maxwidth">
          <motion.h2 {...fadeUp} className="labs-title" style={{textAlign: 'center', marginBottom: '2.2rem', fontWeight: 700, fontSize: '2.1rem', letterSpacing: '-0.01em'}}>Available Laboratory</motion.h2>
          <div className="labs-grid">
            {labsPreview.map((lab, idx) => (
              <motion.div
                key={lab.title}
                className="lab-card"
                {...fadeUp}
                transition={{ delay: idx * 0.15 }}
                style={{display: 'flex', flexDirection: 'column', minHeight: 260, boxShadow: 'var(--shadow-elevated)', borderRadius: 'var(--radius-md)', background: 'linear-gradient(180deg, var(--bg-panel-soft), var(--bg-panel))', border: '1.5px solid var(--border)'}}>
                <div className="lab-card-header" style={{display: 'flex', alignItems: 'center', marginBottom: 10}}>
                  <span className="lab-icon" style={{fontSize: '2.1rem', marginRight: 10}}>{lab.icon}</span>
                  <h3 className="lab-title" style={{fontWeight: 600, fontSize: '1.13rem'}}>{lab.title}</h3>
                </div>
                <p className="lab-description" style={{marginBottom: 10, color: 'var(--text-muted)', fontSize: '0.98rem'}}>{lab.description}</p>
                <div className="lab-features" style={{display: 'flex', flexWrap: 'wrap', gap: '6px 8px', marginBottom: 10}}>
                  {lab.features.map((feature) => (
                    <span key={feature} className="lab-feature-tag" style={{fontSize: '0.85rem', padding: '0.38rem 0.7rem'}}>
                      {feature}
                    </span>
                  ))}
                </div>
                <div style={{flex: 1}} />
                <Link
                  to={lab.link}
                  className="lab-link"
                  style={{marginTop: 'auto', fontWeight: 600, fontSize: '1.01rem', borderRadius: 8, minWidth: 120, textAlign: 'center'}}>
                  Enter Lab <span className="arrow">→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* ================= CTA ================= */}
      <section className="cta-section">
        <div className="cta-content" style={{maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: 'var(--space-24)'}}>
          <h2 style={{fontWeight: 700, fontSize: '2rem', marginBottom: 12}}>Begin Your Learning Journey</h2>
          <p style={{color: 'var(--text-muted)', fontSize: '1.08rem', marginBottom: 24}}>
            Experience structured virtual experiments supported by AI-driven learning assistance.
          </p>
          <Link to="/register" className="btn primary cta-button" style={{minWidth: 180, fontWeight: 600, fontSize: '1.08rem'}}>
            Get Started <span className="btn-icon">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
