import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "~/root";

export function Header() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <header className="mb-10 flex items-center justify-between space-x-5">
      <Link to="/" className="text-2xl font-bold text-slate-800 md:text-3xl">
        Simple Todo
      </Link>
      <div className="flex items-center space-x-5">
        <span className="font-medium text-slate-800">{`Hi ${loaderData.user?.username}`}</span>
        <Link to="/profile" className="font-medium text-slate-800">
          Profile
        </Link>
        <form action="/logout" method="post">
          <button
            type="submit"
            className="h-9 w-full rounded-lg bg-slate-800 px-4 font-bold text-white transition duration-100 hover:bg-slate-900"
          >
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}
