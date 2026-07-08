import React from 'react';

function Button({
    type = 'button',
    variant = 'primary', // primary, secondary, danger, ghost
    size = 'md', // sm, md, lg
    loading = false,
    disabled = false,
    onClick,
    className = '',
    children,
    icon
}) {
    const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-200 focus:outline-none select-none rounded-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer';

    const variants = {
        primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 border border-transparent',
        secondary: 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-250 shadow-sm',
        'secondary-dark': 'bg-white/10 hover:bg-white/15 text-white border border-white/10 shadow-sm',
        danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 border border-transparent',
        'danger-dark': 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/20 shadow-sm',
        ghost: 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 border border-transparent'
    };

    const sizes = {
        sm: 'py-1.5 px-3 text-[11px]',
        md: 'py-2.5 px-5 text-xs',
        lg: 'py-3.5 px-6 text-sm'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
        >
            {loading ? (
                <span className="flex items-center justify-center gap-1.5">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>...</span>
                </span>
            ) : (
                <span className="flex items-center justify-center gap-1.5">
                    {icon && <span className="inline-block">{icon}</span>}
                    {children}
                </span>
            )}
        </button>
    );
}

export default Button;
