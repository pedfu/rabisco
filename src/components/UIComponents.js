import React from 'react';

export const Button = ({ children, onClick, disabled, variant = "primary", className = "" }) => {
  const baseStyle = `px-6 py-3 font-bold uppercase tracking-widest transition-all transform rounded-xl shadow-lg active:translate-y-[1px] active:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`;

  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white hover:from-cyan-400 hover:to-fuchsia-400 shadow-fuchsia-200",
    secondary: "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-slate-100",
    danger: "bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-400 hover:to-orange-400 shadow-red-200",
    success: "bg-gradient-to-r from-lime-500 to-emerald-500 text-white hover:from-lime-400 hover:to-emerald-400 shadow-lime-200"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const Input = ({ value, onChange, placeholder, maxLength, id, type = "text", className = "" }) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    maxLength={maxLength}
    className={`w-full bg-slate-50 border-2 border-slate-200 px-4 py-2 rounded-xl text-lg font-sans outline-none text-slate-900 placeholder-slate-400 focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-100 transition-all ${className}`}
  />
);

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-xl shadow-slate-200/50 ${className}`}>
    {children}
  </div>
);
