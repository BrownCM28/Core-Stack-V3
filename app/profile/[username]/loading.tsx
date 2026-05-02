export default function ProfileLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="h-32 bg-[#E2DDD8] rounded-lg animate-pulse mb-6" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-40 bg-[#E2DDD8] rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  )
}
