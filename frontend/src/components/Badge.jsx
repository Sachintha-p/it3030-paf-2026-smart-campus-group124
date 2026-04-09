import React from 'react';

const colorMap = {
  green:  'badge-green',
  yellow: 'badge-yellow',
  red:    'badge-red',
  blue:   'badge-blue',
  purple: 'badge-purple',
  gray:   'badge-gray',
  orange: 'badge-orange',
};

const Badge = ({ children, color = 'gray' }) => {
  return (
    <span className={`badge ${colorMap[color] || 'badge-gray'}`}>
      {children}
    </span>
  );
};

export default Badge;
