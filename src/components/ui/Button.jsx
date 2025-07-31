import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  style = {},
  ...props 
}) => {
  const baseStyle = {
    fontWeight: 500,
    borderRadius: '6px',
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit'
  };

  const variants = {
    primary: {
      backgroundColor: disabled ? '#d1d5db' : '#2563eb',
      color: 'white',
    },
    secondary: {
      backgroundColor: disabled ? '#f9fafb' : '#f3f4f6',
      color: disabled ? '#9ca3af' : '#374151',
    },
    danger: {
      backgroundColor: disabled ? '#d1d5db' : '#ef4444',
      color: 'white',
    },
  };

  const sizes = {
    sm: { padding: '6px 12px', fontSize: '14px' },
    md: { padding: '8px 16px', fontSize: '14px' },
    lg: { padding: '12px 24px', fontSize: '16px' },
  };

  const buttonStyle = {
    ...baseStyle,
    ...variants[variant],
    ...sizes[size],
    ...style
  };

  const handleMouseOver = (e) => {
    if (!disabled && !loading) {
      if (variant === 'primary') {
        e.target.style.backgroundColor = '#1d4ed8';
      } else if (variant === 'secondary') {
        e.target.style.backgroundColor = '#e5e7eb';
      } else if (variant === 'danger') {
        e.target.style.backgroundColor = '#dc2626';
      }
    }
  };

  const handleMouseOut = (e) => {
    if (!disabled && !loading) {
      e.target.style.backgroundColor = variants[variant].backgroundColor;
    }
  };

  return (
    <button
      style={buttonStyle}
      onClick={disabled || loading ? undefined : onClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg 
          style={{ 
            width: '16px', 
            height: '16px', 
            marginRight: '8px',
            animation: 'spin 1s linear infinite' 
          }} 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
          <path fill="currentColor" strokeWidth="4" style={{ opacity: 0.75 }} d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </button>
  );
};

export default Button;