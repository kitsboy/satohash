export default function GiveABitBadge({ className = '' }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-widest uppercase ${className}`}
      style={{ color: 'var(--text-tertiary)' }}
    >
      <span>Part of</span>
      <a
        href="https://giveabit.io"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'var(--accent-gold)' }}
      >
        Give A Bit
      </a>
      <span>·</span>
      <a
        href="https://motopass.giveabit.io"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        MotoPass
      </a>
      <a
        href="https://giveabit.io/family"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        Family of 8
      </a>
    </div>
  )
}
