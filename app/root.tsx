import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import { Header } from "./components/Header";

import styles from "./styles/app.css";
import { db } from "./utils/db.server";
import { classNames } from "./utils/helpers";
import { getUser } from "./utils/session.server";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Simple todo 🗒️",
  viewport: "width=device-width,initial-scale=1",
});

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);

  const profileConfiguration = await db.profileConfiguration.findUnique({
    select: { askConfirmation: true, colorTheme: true },
    where: {
      userId: user?.id,
    },
  });

  return json({ user, profileConfiguration });
};

export default function App() {
  const { pathname } = useLocation();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body
        className={classNames(
          "mx-auto max-h-screen bg-gray-300 px-4 font-inter sm:max-w-3xl",
          pathname !== "/login" ? "mt-10" : ""
        )}
      >
        {pathname !== "/login" && <Header />}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
