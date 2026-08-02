export function SkeletonCard() {
  return (
    <div className="bg-surface rounded-2xl p-6 shadow-surface-sm border border-divider flex items-center gap-4 relative overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-surface-elevated to-transparent opacity-50" />
      <div className="w-16 h-16 rounded-xl bg-surface-elevated" />
      <div className="space-y-3 flex-1">
        <div className="h-4 bg-surface-elevated rounded w-1/2" />
        <div className="h-8 bg-surface-elevated rounded w-3/4" />
      </div>
    </div>
  );
}

export function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-surface rounded-2xl shadow-surface-md border border-divider overflow-hidden w-full relative">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-surface-elevated to-transparent opacity-50 z-20 pointer-events-none" />
      <div className="bg-surface-elevated border-b border-divider h-12 w-full" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border-b border-divider h-16 w-full flex items-center px-4 gap-4">
          <div className="h-6 bg-surface-elevated rounded w-32" />
          <div className="h-6 bg-surface-elevated rounded-full w-20" />
          <div className="h-6 bg-surface-elevated rounded w-16" />
          <div className="h-6 bg-surface-elevated rounded w-16" />
          <div className="flex gap-2 flex-1">
            <div className="h-6 bg-surface-elevated rounded w-16" />
            <div className="h-6 bg-surface-elevated rounded w-16" />
          </div>
          <div className="h-8 bg-surface-elevated rounded w-32" />
        </div>
      ))}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
