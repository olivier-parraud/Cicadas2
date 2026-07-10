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
        primary: 'bg-[#F4AF23] hover:bg-[#ffbe3b] text-[#05040a] font-extrabold shadow-md shadow-amber-500/10 border border-transparent',
        secondary: 'bg-[#563D82]/10 hover:bg-[#563D82]/20 text-[#cfc2eb] border border-[#563D82]/30 shadow-sm',
        'secondary-dark': 'bg-white/5 hover:bg-white/10 text-white border border-white/10 shadow-sm',
        danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 border border-transparent',
        'danger-dark': 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/20 shadow-sm',
        ghost: 'text-slate-400 hover:text-[#F4AF23] hover:bg-[#563D82]/10 border border-transparent'
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
