// Skeleton loading placeholders for JobCard and TalentCard.
// Use these while data is loading — same dimensions as the real cards.

function Pulse({ className }: { className: string }) {
  return <div className={`bg-[#E2DDD8] animate-pulse rounded-[4px] ${className}`} />;
}

export function SkeletonJobCard() {
  return (
    <div className="bg-surface rounded-[8px] p-5 border-[1.5px] border-[#E2DDD8]">
      {/* Badge row */}
      <div className="flex gap-1.5 mb-3">
        <Pulse className="h-5 w-10" />
        <Pulse className="h-5 w-20" />
      </div>
      {/* Title */}
      <Pulse className="h-5 w-3/4 mb-2" />
      {/* Company */}
      <Pulse className="h-3.5 w-1/3 mb-4" />
      {/* Location row */}
      <div className="flex gap-4 mb-4">
        <Pulse className="h-3 w-20" />
        <Pulse className="h-3 w-16" />
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#E2DDD8]">
        <Pulse className="h-4 w-16" />
        <Pulse className="h-4 w-12" />
      </div>
    </div>
  );
}

export function SkeletonJobListingCard() {
  return (
    <div className="bg-surface rounded-[8px] p-6 border-[1.5px] border-[#E2DDD8]">
      {/* Badge row */}
      <div className="flex gap-1.5 mb-3">
        <Pulse className="h-5 w-10" />
        <Pulse className="h-5 w-20" />
        <Pulse className="h-5 w-14" />
      </div>
      {/* Title */}
      <Pulse className="h-6 w-2/3 mb-2" />
      {/* Company line */}
      <Pulse className="h-4 w-1/2 mb-4" />
      {/* Salary */}
      <Pulse className="h-4 w-24 mb-3" />
      {/* Description lines */}
      <Pulse className="h-4 w-full mb-1.5" />
      <Pulse className="h-4 w-5/6 mb-5" />
      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E2DDD8]">
        <Pulse className="h-4 w-20" />
        <Pulse className="h-8 w-28 rounded-[6px]" />
      </div>
    </div>
  );
}

export function SkeletonTalentCard() {
  return (
    <div className="bg-surface rounded-[8px] p-5 border-[1.5px] border-[#E2DDD8] flex flex-col">
      {/* Header row */}
      <div className="flex items-start gap-3 mb-4">
        <Pulse className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1">
          <Pulse className="h-4 w-28 mb-1.5" />
          <Pulse className="h-3 w-20" />
        </div>
      </div>
      {/* Location + role */}
      <Pulse className="h-3 w-32 mb-4" />
      {/* Language pills */}
      <div className="flex gap-1.5 mb-3">
        <Pulse className="h-5 w-14" />
        <Pulse className="h-5 w-10" />
        <Pulse className="h-5 w-20" />
      </div>
      {/* Cert pills */}
      <div className="flex gap-1.5 mb-4">
        <Pulse className="h-5 w-10" />
        <Pulse className="h-5 w-10" />
      </div>
      {/* Footer */}
      <div className="pt-3 border-t border-[#E2DDD8] mt-auto">
        <Pulse className="h-7 w-28 rounded-[6px]" />
      </div>
    </div>
  );
}
