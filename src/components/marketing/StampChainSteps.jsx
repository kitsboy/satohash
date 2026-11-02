/**
 * The three-step path: file stays, calendars write, our node checks.
 * The live tip sits inside the check step.
 */
export default function StampChainSteps({ t, blockHeight }) {
  const steps = [
    ['stepFile', 'stepFileBody'],
    ['stepWrite', 'stepWriteBody'],
    ['stepCheck', 'stepCheckBody']
  ]
  const tip = blockHeight ? Number(blockHeight).toLocaleString() : null

  return (
    <ol className="grid grid-cols-1 gap-3 text-left sm:grid-cols-3 sm:gap-4">
      {steps.map(([titleKey, bodyKey]) => (
        <li
          key={titleKey}
          className="min-w-0 overflow-hidden rounded-2xl p-3 sm:p-4"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
          data-testid={titleKey === 'stepCheck' ? 'chain-step-check' : undefined}
        >
          <span
            className="mb-1 block text-[9px] font-bold tracking-wider uppercase sm:text-[10px]"
            style={{ color: 'var(--accent-gold)' }}
          >
            {t(`landingPage.telemetry.${titleKey}`)}
          </span>
          <span className="block text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>
            {t(`landingPage.telemetry.${bodyKey}`)}
          </span>
          {titleKey === 'stepCheck' ? (
            <span className="mt-3 block">
              <span
                className="block font-mono text-2xl font-black tabular-nums"
                style={{ color: 'var(--text-primary)' }}
                data-testid="chain-tip"
              >
                {tip ? `#${tip}` : '—'}
              </span>
              <span
                className="mt-1 block text-[9px] font-bold tracking-wider uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                {t('landingPage.telemetry.tipHeight')}
              </span>
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
