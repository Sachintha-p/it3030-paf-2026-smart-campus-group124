import React from 'react';

const Spinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = { sm: 'h-5 w-5', md: 'h-10 w-10', lg: 'h-16 w-16' };
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className={`${sizes[size]} animate-spin rounded-full border-4 border-surface-border border-t-gold-500`} />
      {text && <p className="text-slate-500 text-sm">{text}</p>}
    </div>
  );
};

export default Spinner;
