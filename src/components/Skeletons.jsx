export const SkeletonCard = () => (
  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 animate-pulse">
    <div className="w-12 h-12 rounded-lg bg-[var(--surface-raised)] mb-4" />
    <div className="h-6 bg-[var(--surface-raised)] rounded mb-2 w-3/4" />
    <div className="h-4 bg-[var(--surface-raised)] rounded mb-1 w-full" />
    <div className="h-4 bg-[var(--surface-raised)] rounded w-2/3" />
  </div>
);

export const SkeletonEndpoint = () => (
  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden animate-pulse">
    <div className="px-6 py-4 flex items-center gap-4">
      <div className="w-16 h-6 bg-[var(--surface-raised)] rounded" />
      <div className="h-4 bg-[var(--surface-raised)] rounded w-48" />
      <div className="flex-1 h-4 bg-[var(--surface-raised)] rounded" />
      <div className="w-16 h-4 bg-[var(--surface-raised)] rounded" />
    </div>
  </div>
);

export const SkeletonText = ({ lines = 3 }) => (
  <div className="space-y-2 animate-pulse">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-4 bg-[var(--surface-raised)] rounded"
        style={{ width: i === lines - 1 ? '60%' : '100%' }}
      />
    ))}
  </div>
);

export const SkeletonApiKey = () => (
  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 animate-pulse">
    <div className="flex items-center justify-between mb-2">
      <div className="h-4 bg-[var(--surface-raised)] rounded w-24" />
      <div className="h-6 bg-[var(--surface-raised)] rounded w-20" />
    </div>
    <div className="flex items-center gap-2">
      <div className="flex-1 h-12 bg-[var(--surface-raised)] rounded-lg" />
      <div className="w-12 h-12 bg-[var(--surface-raised)] rounded-lg" />
    </div>
  </div>
);

export const SkeletonContractCard = () => (
  <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 animate-pulse md:p-8">
    <div className="flex items-start justify-between mb-5">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-7 w-48 bg-[var(--surface-raised)] rounded" />
          <div className="h-5 w-20 bg-[var(--surface-raised)] rounded" />
        </div>
        <div className="h-4 w-32 bg-[var(--surface-raised)] rounded" />
      </div>
      <div className="h-10 w-10 bg-[var(--surface-raised)] rounded-xl" />
    </div>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <div className="h-3 w-20 bg-[var(--surface-raised)] rounded" />
        <div className="h-14 bg-[var(--surface-raised)] rounded-xl" />
        <div className="h-14 bg-[var(--surface-raised)] rounded-xl" />
      </div>
      <div className="space-y-3">
        <div className="h-3 w-20 bg-[var(--surface-raised)] rounded" />
        <div className="h-20 bg-[var(--surface-raised)] rounded-xl" />
        <div className="h-11 bg-[var(--surface-raised)] rounded-xl" />
      </div>
    </div>
  </div>
);
