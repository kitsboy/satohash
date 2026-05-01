import * as Tooltip from '@radix-ui/react-tooltip'

export default function InfoTooltip({ children, content }) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={8}
            className="animate-in fade-in zoom-in-95 z-[500] rounded-xl border border-[var(--border-bright)] bg-[var(--bg-secondary)] px-4 py-3 text-xs font-medium text-[var(--text-primary)] shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl duration-200 select-none"
          >
            <div className="max-w-[200px] leading-relaxed">{content}</div>
            <Tooltip.Arrow className="fill-[var(--border-bright)]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
