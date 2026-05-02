export default function TalentLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        <div className="w-72 flex-shrink-0">
          <div className="h-96 bg-[#E2DDD8] rounded-lg animate-pulse" />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-[#E2DDD8] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
