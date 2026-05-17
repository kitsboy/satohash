export const SkeletonCard = () => (
  <div className="animate-pulse rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
    <div className="mb-4 h-12 w-12 rounded-lg bg-[var(--surface-raised)]" />
    <div className="mb-2 h-6 w-3/4 rounded bg-[var(--surface-raised)]" />
    <div className="mb-1 h-4 w-full rounded bg-[var(--surface-raised)]" />
    <div className="h-4 w-2/3 rounded bg-[var(--surface-raised)]" />
  </div>
)

export const SkeletonEndpoint = () => (
  <div className="animate-pulse overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="h-6 w-16 rounded bg-[var(--surface-raised)]" />
      <div className="h-4 w-48 rounded bg-[var(--surface-raised)]" />
      <div className="h-4 flex-1 rounded bg-[var(--surface-raised)]" />
      <div className="h-4 w-16 rounded bg-[var(--surface-raised)]" />
    </div>
  </div>
)

export const SkeletonText = ({ lines = 3 }) => (
  <div className="animate-pulse space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-4 rounded bg-[var(--surface-raised)]"
        style={{ width: i === lines - 1 ? '60%' : '100%' }}
      />
    ))}
  </div>
)

export const SkeletonApiKey = () => (
  <div className="animate-pulse rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
    <div className="mb-2 flex items-center justify-between">
      <div className="h-4 w-24 rounded bg-[var(--surface-raised)]" />
      <div className="h-6 w-20 rounded bg-[var(--surface-raised)]" />
    </div>
    <div className="flex items-center gap-2">
      <div className="h-12 flex-1 rounded-lg bg-[var(--surface-raised)]" />
      <div className="h-12 w-12 rounded-lg bg-[var(--surface-raised)]" />
    </div>
  </div>
)

export const SkeletonContractCard = () => (
  <div className="animate-pulse rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 md:p-8">
    <div className="mb-5 flex items-start justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-7 w-48 rounded bg-[var(--surface-raised)]" />
          <div className="h-5 w-20 rounded bg-[var(--surface-raised)]" />
        </div>
        <div className="h-4 w-32 rounded bg-[var(--surface-raised)]" />
      </div>
      <div className="h-10 w-10 rounded-xl bg-[var(--surface-raised)]" />
    </div>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <div className="h-3 w-20 rounded bg-[var(--surface-raised)]" />
        <div className="h-14 rounded-xl bg-[var(--surface-raised)]" />
        <div className="h-14 rounded-xl bg-[var(--surface-raised)]" />
      </div>
      <div className="space-y-3">
        <div className="h-3 w-20 rounded bg-[var(--surface-raised)]" />
        <div className="h-20 rounded-xl bg-[var(--surface-raised)]" />
        <div className="h-11 rounded-xl bg-[var(--surface-raised)]" />
      </div>
    </div>
  </div>
)
