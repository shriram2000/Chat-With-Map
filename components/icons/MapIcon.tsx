import React from 'react';

export const MapIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M9 18l6 -3l6 3l-6 -12l-6 12z" />
    <path d="M3 18l6 -3l-6 -12" />
    <path d="M15 15l-6 3" />
  </svg>
);
