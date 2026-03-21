export const SkeletonCard = () => (
  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 animate-pulse">
    <div className="w-12 h-12 rounded-lg bg-gray-700 mb-4" />
    <div className="h-6 bg-gray-700 rounded mb-2 w-3/4" />
    <div className="h-4 bg-gray-700 rounded mb-1 w-full" />
    <div className="h-4 bg-gray-700 rounded w-2/3" />
  </div>
);

export const SkeletonEndpoint = () => (
  <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden animate-pulse">
    <div className="px-6 py-4 flex items-center gap-4">
      <div className="w-16 h-6 bg-gray-700 rounded" />
      <div className="h-4 bg-gray-700 rounded w-48" />
      <div className="flex-1 h-4 bg-gray-700 rounded" />
      <div className="w-16 h-4 bg-gray-700 rounded" />
    </div>
  </div>
);

export const SkeletonText = ({ lines = 3 }) => (
  <div className="space-y-2 animate-pulse">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-4 bg-gray-700 rounded"
        style={{ width: i === lines - 1 ? '60%' : '100%' }}
      />
    ))}
  </div>
);

export const SkeletonApiKey = () => (
  <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700 animate-pulse">
    <div className="flex items-center justify-between mb-2">
      <div className="h-4 bg-gray-700 rounded w-24" />
      <div className="h-6 bg-gray-700 rounded w-20" />
    </div>
    <div className="flex items-center gap-2">
      <div className="flex-1 h-12 bg-gray-700 rounded-lg" />
      <div className="w-12 h-12 bg-gray-700 rounded-lg" />
    </div>
  </div>
);
