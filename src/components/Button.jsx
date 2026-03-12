export default function Button({
    children,
    variant = 'primary',
    size = 'default',
    disabled = false,
    loading = false,
    fullWidth = false,
    onClick,
    type = 'button',
    className = '',
    ...props
}) {
    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200',
        secondary: 'bg-slate-800 text-white hover:bg-slate-900 shadow-slate-200',
        outline: 'bg-transparent border-2 border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
        danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200'
    };

    const sizes = {
        default: 'px-6 py-3 text-sm',
        large: 'px-8 py-4 text-base',
        small: 'px-4 py-2 text-xs'
    };

    const baseClasses = 'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-sm';

    const classes = [
        baseClasses,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : null}
            {children}
        </button>
    );
}
