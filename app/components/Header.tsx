import { useLoaderData } from "@remix-run/react";
import type { loader } from "~/routes";

type HeaderProps = {
  username?: string;
};

export function Header({ username }: HeaderProps) {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <header className="mb-10 flex items-center justify-between space-x-5">
      <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
        Simple Todo
      </h1>
      <div className="flex items-center space-x-5">
        <span className="font-medium text-slate-800">{`Hi ${loaderData.user?.username}`}</span>
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
