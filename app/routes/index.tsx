import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { TodoTable } from "~/components/TodoTable";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import { getUser, requireUserId } from "~/utils/session.server";

function validateTodoText(todoText: string) {
  if (!todoText) {
    return "The text can not be empty";
  }
}

export const action = async ({ request }: LoaderArgs) => {
  const form = await request.formData();
  const userId = await requireUserId(request);

  switch (request.method) {
    case "DELETE": {
      const todoId = form.get("id");

      if (typeof todoId !== "string") {
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

      if (todo.userId !== userId) {
        throw new Response("Pssh, nice try. That's not your todo", {
          status: 403,
        });
      }

      await db.todo.delete({ where: { id: todoId } });

      return redirect("/");
    }
    case "POST": {
      const todoText = form.get("todo-text");

      if (typeof todoText !== "string") {
        return badRequest({
          fieldErrors: null,
          fields: null,
          formError: `Form not submitted correctly.`,
        });
      }

      const fieldErrors = {
        todoText: validateTodoText(todoText),
      };

      const fields = { todoText };

      if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({
          fieldErrors,
          fields,
          formError: null,
        });
      }

      await db.todo.create({
        data: {
          text: todoText,
          userId: userId,
        },
      });

      return redirect("/");
    }
    default: {
      throw new Response("Method not allowed", {
        status: 405,
      });
    }
  }
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
  return (
    <main>
      <TodoTable />
    </main>
  );
}
