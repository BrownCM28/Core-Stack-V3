'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-red-400 mb-4">Something went wrong</p>
      <h1 className="font-mono text-4xl font-bold text-[#0D0F12] mb-4">
        Unexpected error.
      </h1>
      <p className="text-[#6B6560] mb-8 max-w-sm">
        An error occurred while loading this page. Please try again.
      </p>
      {error.digest && (
        <p className="font-mono text-xs text-gray-300 mb-8">
          Error ID: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        className="btn-primary px-4 py-2 text-sm font-mono rounded-md"
      >
        Try again
      </button>
    </div>
  )
}
