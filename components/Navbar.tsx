import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#2B2B2B] bg-[#090909]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-red-500">
            BJJ<span className="text-red-500">Seminars & Events</span> Kraków,
            Poland
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Events
          </Link>
          <Link
            href="/submit-event"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Submit Event
          </Link>
        </nav>
      </div>
    </header>
  );
}
