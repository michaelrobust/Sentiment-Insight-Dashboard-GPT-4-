import React from 'react';

const Card = ({ children, className = '', title, subtitle, style = {} }) => {
  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    padding: '24px',
    ...style
  };

  return (
    <div style={cardStyle} className={className}>
      {title && (
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 600, 
            color: '#111827',
            margin: '0 0 4px 0'
          }}>
            {title}
          </h3>
          {subtitle && (
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280', 
              margin: 0 
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;