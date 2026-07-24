import { Skeleton } from "@/components/ui/skeleton";

export default function InvoicesLoading() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-primary/10 p-6">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-7 w-32" />
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="rounded-xl bg-primary/10 p-6">
        <Skeleton className="h-10 w-64" />
      </div>

      {/* Table */}
      <div className="rounded-xl bg-primary/10 p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
