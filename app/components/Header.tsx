import { Link, useRouteLoaderData } from "@remix-run/react";
import { classNames } from "~/utils/helpers";

export function Header() {
  const rootLoaderData = useRouteLoaderData("root") as any; // TODO: delete any

  const colorTheme = rootLoaderData.profileConfiguration.colorTheme;

  return (
    <header className="mb-10 flex items-center justify-between space-x-5">
      <Link
        to="/"
        className={classNames(
          "text-2xl font-bold md:text-3xl",
          `text-${colorTheme}-800`
        )}
      >
        Simple Todo
      </Link>
      <div className="flex items-center space-x-5">
        <span
          className={classNames("font-medium", `text-${colorTheme}-800`)}
        >{`Hi ${rootLoaderData.user?.username}`}</span>
        <Link
          to="/profile"
          className={classNames("font-medium", `text-${colorTheme}-800`)}
        >
          Profile
        </Link>
        <form action="/logout" method="post">
          <button
            type="submit"
            className={classNames(
              "h-9 w-full rounded-lg px-4 font-bold text-white transition duration-100",
              `bg-${colorTheme}-800 hover:bg-${colorTheme}-900`
            )}
          >
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}
