import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Header } from "~/components/Header";
import { db } from "~/utils/db.server";
import { classNames } from "~/utils/helpers";
import { badRequest } from "~/utils/request.server";
import { requireUserId } from "~/utils/session.server";

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const userId = await requireUserId(request);

  const confirmation = form.get("confirmation");
  const colorScheme = form.get("colorScheme");

  if (typeof confirmation !== "string" || typeof colorScheme !== "string") {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: `Form not submitted correctly.`,
    });
  }

  // const profileConfiguration = await db.profileConfiguration.findUnique({
  //   where: { userId },
  // });
  // TODO: if (!profileConfiguration) {}

  await db.profileConfiguration.update({
    where: { userId },
    data: {
      askConfirmation: confirmation === "on" ? true : false,
      colorTheme: colorScheme,
    },
  });

  return json({});
};

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);

  const profileConfiguration = await db.profileConfiguration.findUnique({
    select: { askConfirmation: true, colorTheme: true },
    where: { userId },
  });

  if (!profileConfiguration) return redirect("/login");

  return json({
    profileConfiguration,
  });
};

const colors = [
  "Slate",
  "Gray",
  "Zinc",
  "Orange",
  "Neutral",
  "Stone",
  "Red",
  "Amber",
  "Yellow",
  "Lime",
  "Green",
  "Emerald",
  "Teal",
  "Cyan",
  "Sky",
  "Blue",
  "Indigo",
  "Violet",
  "Purple",
  "Fuchsia",
  "Pink",
  "Rose",
];

export default function Profile() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <main className="mx-auto mt-10 max-h-screen px-4 sm:max-w-3xl">
      <Header />
      <div className="h-[450px] rounded-md bg-gray-100 p-10 shadow-2xl">
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 md:text-2xl">
            Profile configuration
          </h2>
        </header>
        <Form method="put" className="mt-4">
          <div className="mb-5 flex items-center space-x-3">
            <label
              htmlFor="confirmation"
              className="select-none font-semibold text-slate-800"
            >
              Delete confirmation
            </label>
            <input
              type="checkbox"
              name="confirmation"
              id="confirmation"
              defaultChecked={loaderData.profileConfiguration.askConfirmation}
              className="accent-slate-800"
            />
          </div>
          <div className="mb-5 flex flex-col items-start space-y-3">
            <p className="select-none font-semibold text-slate-800">
              Color theme
            </p>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color) => (
                <div key={color} className="space-x-3">
                  <input
                    type="radio"
                    name="colorScheme"
                    value={color.toLowerCase()}
                    id={color.toLowerCase()}
                    className={classNames(`accent-${color.toLowerCase()}-800`)}
                    // className="accent-pink-800"
                    defaultChecked={
                      loaderData.profileConfiguration.colorTheme.toLowerCase() ===
                      color.toLowerCase()
                    }
                  />
                  <label htmlFor={color.toLowerCase()}>{color}</label>
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="h-9 rounded-lg bg-slate-800 px-4 font-bold text-white transition duration-100 hover:bg-slate-900"
          >
            Save
          </button>
        </Form>
      </div>
    </main>
  );
}
