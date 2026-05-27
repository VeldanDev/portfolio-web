// Shown by Next.js while the async server component fetches data

function PulseBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-[#1a1a1a] ${className}`} />;
}

function CardSkeleton({ tall }: { tall?: boolean }) {
  return (
    <div
      className={`rounded-lg border border-[#1f1f1f] bg-[#111111] p-5 flex flex-col gap-3 ${
        tall ? 'min-h-[120px]' : ''
      }`}
    >
      <PulseBlock className="h-3 w-24" />
      <PulseBlock className="h-7 w-16 mt-1" />
      <PulseBlock className="h-2.5 w-20 mt-auto" />
    </div>
  );
}

function BarSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <PulseBlock className="h-3 w-20 shrink-0" />
      <div className="flex-1 h-1.5 rounded-full bg-[#1a1a1a] overflow-hidden">
        <div className="animate-pulse h-full w-1/2 rounded-full bg-[#222]" />
      </div>
      <PulseBlock className="h-3 w-8 shrink-0" />
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="min-h-screen px-6 py-14 md:py-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-14 flex flex-col gap-3">
        <PulseBlock className="h-3 w-24" />
        <PulseBlock className="h-10 w-48" />
        <PulseBlock className="h-3 w-36" />
      </div>

      {/* GitHub section */}
      <div className="mb-12">
        <div className="mb-6 flex flex-col gap-2">
          <PulseBlock className="h-2.5 w-20" />
          <PulseBlock className="h-6 w-36" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
        <div className="rounded-lg border border-[#1f1f1f] bg-[#111111] p-5 flex flex-col gap-3">
          <PulseBlock className="h-3 w-32 mb-1" />
          {Array.from({ length: 6 }).map((_, i) => <BarSkeleton key={i} />)}
        </div>
      </div>

      {/* WakaTime section */}
      <div className="mb-12">
        <div className="mb-6 flex flex-col gap-2">
          <PulseBlock className="h-2.5 w-20" />
          <PulseBlock className="h-6 w-40" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <CardSkeleton tall />
          <CardSkeleton tall />
        </div>
        <div className="rounded-lg border border-[#1f1f1f] bg-[#111111] p-5 flex flex-col gap-3">
          <PulseBlock className="h-3 w-32 mb-1" />
          {Array.from({ length: 5 }).map((_, i) => <BarSkeleton key={i} />)}
        </div>
      </div>

      {/* Coming soon placeholders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <CardSkeleton tall />
        <CardSkeleton tall />
      </div>
    </div>
  );
}
