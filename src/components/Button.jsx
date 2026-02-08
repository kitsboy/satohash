export default function Button({
    children,
    variant = 'primary',
    size = 'default',
    disabled = false,
    loading = false,
    onClick,
    type = 'button',
    className = '',
    ...props
}) {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = size !== 'default' ? `btn-${size}` : '';

    const classes = [baseClass, variantClass, sizeClass, className]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && <span className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>}
            {children}
        </button>
    );
}
