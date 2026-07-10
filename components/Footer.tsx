export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#2B2B2B] bg-[#090909]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} BJJ Around ADCC Poland
          </p>
          <p className="text-xs text-zinc-600">
            Find seminars, open mats and camps during ADCC weekend.
          </p>
        </div>
      </div>
    </footer>
  );
}
