export default function Card({
    children,
    interactive = false,
    onClick,
    className = '',
    ...props
}) {
    const classes = [
        'card',
        interactive && 'card-interactive',
        className
    ].filter(Boolean).join(' ');

    return (
        <div
            className={classes}
            onClick={interactive ? onClick : undefined}
            {...props}
        >
            {children}
        </div>
    );
}
