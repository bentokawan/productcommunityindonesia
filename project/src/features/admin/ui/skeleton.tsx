export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="h-12 w-64 animate-pulse rounded-full bg-admin-surface-muted" />
        <div className="h-12 w-36 animate-pulse rounded-full bg-admin-surface-muted" />
      </div>
      <div className="space-y-2 rounded-admin-inner bg-admin-surface p-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-14 w-full animate-pulse rounded-admin-textarea bg-admin-surface-muted"
          />
        ))}
      </div>
    </div>
  );
}
