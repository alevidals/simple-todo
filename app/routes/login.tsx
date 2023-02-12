import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { InputError } from "~/components/InputError";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import {
  createUserSession,
  getUserId,
  login,
  register,
} from "~/utils/session.server";

function validateUsername(username: string) {
  if (username.length < 3) {
    return "Username must be at least 3 characters long";
  }
}

function validatePassword(password: string) {
  if (password.length < 5) {
    return "Password must be at least 3 characters long";
  }
}

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();

  const loginType = form.get("loginType");
  const username = form.get("username");
  const password = form.get("password");

  if (
    typeof loginType !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form submitted incorrectly",
    });
  }

  const fields = { loginType, username, password };

  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  switch (loginType) {
    case "login": {
      const user = await login({ username, password });

      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `Username/Password combination is incorrect`,
        });
      }

      return createUserSession(user.id, "/");
    }
    case "register": {
      const userExists = await db.user.findFirst({
        where: { username },
      });

      if (userExists) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `Username with username ${username} already exists`,
        });
      }

      const user = await register({ username, password });

      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `Something went wrong trying to create a new user`,
        });
      }

      return createUserSession(user.id, "/");
    }
    default: {
      return badRequest({
        fieldErrors: null,
        fields,
        formError: "Login type invalid",
      });
    }
  }
};

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);

  if (userId) return redirect("/");

  return json({});
};

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <main className="flex h-screen items-center justify-center px-4 sm:px-0">
      <Form
        method="post"
        className="w-96 rounded-lg bg-gray-100 p-5 shadow-2xl"
      >
        <h1 className="text-center text-3xl font-semibold text-slate-800">
          Simple Todo
        </h1>
        <div className="my-4 flex justify-center space-x-5">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="loginType"
              id="login"
              value="login"
              defaultChecked={
                !actionData?.fields?.loginType ||
                actionData.fields.loginType === "login"
              }
              className="peer accent-slate-800"
            />
            <label
              htmlFor="login"
              className="select-none text-slate-800 peer-checked:font-medium"
            >
              Login
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="loginType"
              id="register"
              value="register"
              defaultChecked={actionData?.fields?.loginType === "register"}
              className="peer accent-slate-800"
            />
            <label
              htmlFor="register"
              className="select-none text-slate-800 peer-checked:font-medium"
            >
              Register
            </label>
          </div>
        </div>
        <div className="mb-5 flex flex-col space-y-2">
          <label
            htmlFor="username"
            className="select-none font-semibold text-slate-800"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            defaultValue={actionData?.fields?.username}
            aria-invalid={
              Boolean(actionData?.fieldErrors?.username) || undefined
            }
            aria-errormessage={
              actionData?.fieldErrors?.username ? "username-error" : undefined
            }
            className="h-11 rounded-md bg-gray-300 px-3 text-slate-800 accent-slate-800"
          />
          {actionData?.fieldErrors?.username ? (
            <InputError text={actionData.fieldErrors.username} />
          ) : null}
        </div>
        <div className="mb-5 flex flex-col space-y-2">
          <label
            htmlFor="password"
            className="select-none font-semibold text-slate-800"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            defaultValue={actionData?.fields?.password}
            aria-invalid={
              Boolean(actionData?.fieldErrors?.password) || undefined
            }
            aria-errormessage={
              actionData?.fieldErrors?.password ? "password-error" : undefined
            }
            className="h-11 rounded-md bg-gray-300 px-3 text-slate-800 accent-slate-800"
          />
          {actionData?.fieldErrors?.password ? (
            <InputError text={actionData.fieldErrors.password} />
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <InputError text={actionData.formError} className="mb-5" />
          ) : null}
        </div>
        <button
          type="submit"
          className="h-11 w-full rounded-lg bg-slate-800 px-4 font-bold text-white transition duration-100 hover:bg-slate-900"
        >
          Submit
        </button>
      </Form>
    </main>
  );
}
