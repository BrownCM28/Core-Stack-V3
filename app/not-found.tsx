import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-[#3ECF8E] mb-4">404</p>
      <h1 className="font-mono text-4xl font-bold text-[#0D0F12] mb-4">
        Page not found.
      </h1>
      <p className="text-[#6B6560] mb-8 max-w-sm">
        The page you are looking for does not exist or has been removed.
      </p>
      <div className="flex gap-4">
        <Link href="/" className="btn-primary px-4 py-2 text-sm font-mono rounded-md">
          Go home
        </Link>
        <Link href="/jobs" className="btn-wire px-4 py-2 text-sm font-mono rounded-md">
          Browse jobs
        </Link>
      </div>
    </div>
  )
}
