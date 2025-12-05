import React, { useState, useEffect } from "react";

const ProjectNoTailwind = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
      padding: '20px'
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    hero: {
      textAlign: 'center',
      marginBottom: '60px'
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(59, 130, 246, 0.1)',
      color: '#2563eb',
      padding: '8px 16px',
      borderRadius: '9999px',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '32px',
      border: '1px solid rgba(59, 130, 246, 0.2)'
    },
    title: {
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '24px',
      background: 'linear-gradient(to right, #3b82f6, #10b981, #047857)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    subtitle: {
      fontSize: '1.125rem',
      color: '#64748b',
      maxWidth: '768px',
      margin: '0 auto 40px',
      lineHeight: '1.6'
    },
    buttons: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonPrimary: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: '#3b82f6',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      textDecoration: 'none'
    },
    buttonSecondary: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'transparent',
      color: '#3b82f6',
      padding: '12px 24px',
      borderRadius: '8px',
      border: '2px solid #3b82f6',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      textDecoration: 'none'
    }
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Hero Section */}
        <div style={styles.hero}>
          <div style={styles.badge}>
            <span>✨</span>
            <span>Ecological Initiative</span>
          </div>
          
          <h1 style={styles.title}>
            Sustainable Waste Management
          </h1>
          
          <p style={styles.subtitle}>
            Join us in creating a cleaner, more sustainable future through innovative waste management solutions.
          </p>

          <div style={styles.buttons}>
            <a href="/guide" style={styles.buttonPrimary}>
              <span>▶</span>
              <span>Discover the project</span>
              <span>→</span>
            </a>
            <a href="/resources" style={styles.buttonSecondary}>
              <span>🔗</span>
              <span>View resources</span>
            </a>
          </div>
        </div>

        {/* Bins Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '32px',
            color: '#1f2937'
          }}>
            Our Sorting Bins
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {[
              { name: 'Paper', color: '#f59e0b', icon: '📄' },
              { name: 'Plastic', color: '#3b82f6', icon: '📦' },
              { name: 'Metal', color: '#6b7280', icon: '🗑️' },
              { name: 'Organic', color: '#10b981', icon: '🍎' }
            ].map((bin, index) => (
              <div key={index} style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                textAlign: 'center',
                border: `2px solid ${bin.color}30`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '16px',
                  background: `${bin.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '32px'
                }}>
                  {bin.icon}
                </div>
                <h3 style={{
                  fontWeight: 'bold',
                  fontSize: '1.125rem',
                  color: '#1f2937'
                }}>
                  {bin.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectNoTailwind;
