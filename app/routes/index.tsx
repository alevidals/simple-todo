import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Header } from "~/components/Header";
import { TodoTable } from "~/components/TodoTable";
import { db } from "~/utils/db.server";
import { getUser, getUserId, requireUserId } from "~/utils/session.server";

export const action = async ({ request }: LoaderArgs) => {
  const form = await request.formData();

  if (request.method === "DELETE") {
    const todoId = form.get("id");

    if (!todoId || typeof todoId !== "string") {
      throw new Response("There was a problem trying to delete the todo", {
        status: 400,
      });
    }

    const todo = await db.todo.findUnique({
      where: { id: todoId },
    });

    if (!todo) {
      throw new Response("Can't delete what does not exist", {
        status: 404,
      });
    }

    const userId = await getUserId(request);

    if (todo.userId !== userId) {
      throw new Response("Pssh, nice try. That's not your todo", {
        status: 403,
      });
    }

    await db.todo.delete({ where: { id: todoId } });

    return redirect("/");
  }

  return redirect("/");
};

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);

  const user = await getUser(request);

  const todos = await db.todo.findMany({
    select: { id: true, text: true },
    where: { userId: user?.id },
  });

  return json({
    user,
    todos,
  });
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <main className="mx-auto mt-10 max-w-3xl">
      <Header username={loaderData.user?.username} />
      <TodoTable todos={loaderData.todos} />
    </main>
  );
}
