import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="border-b border-sky-100 bg-white/80 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
          Volunteer Connect
        </Link>
        <ul className="flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50/80 p-1">
          <li>
            <Link
              href="/"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-sky-700"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/opportunities"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-sky-700"
            >
              Opportunities
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}