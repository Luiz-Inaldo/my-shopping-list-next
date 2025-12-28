export function AppLoader({ size = 40, strokeColor }: { size?: number, strokeColor?: string }) {
    return (
        <div className="loader">
            <svg width={size} height={size} viewBox="25 25 50 50">
                <circle stroke={strokeColor || 'var(--app-primary)'} r="20" cy="50" cx="50"></circle>
            </svg>
        </div>
    )
}
