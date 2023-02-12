import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Header } from "~/components/Header";
import { TodoTable } from "~/components/TodoTable";
import { getUser, requireUserId } from "~/utils/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);

  const user = await getUser(request);

  return json({
    user,
  });
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <main className="container mx-auto mt-10">
      <Header username={loaderData.user?.username} />
      <TodoTable />
    </main>
  );
}
