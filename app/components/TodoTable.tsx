import { PlusIcon } from "@heroicons/react/20/solid";
import {
  Form,
  useActionData,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { action, loader } from "~/routes";
import { InputError } from "./InputError";
import { Todo } from "./Todo";
import { classNames } from "~/utils/helpers";

export function TodoTable() {
  const actionData = useActionData<typeof action>();
  const indexLoaderData = useLoaderData<typeof loader>();
  const rootLoaderData = useRouteLoaderData("root") as any; // TODO: delete any

  const [isOpen, setIsOpen] = useState(false);

  const color = rootLoaderData.profileConfiguration.colorTheme;

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div className="h-[450px] rounded-md bg-gray-100 p-10 shadow-2xl">
      <header className="flex items-center justify-between">
        <h2
          className={classNames(
            "text-xl font-semibold md:text-2xl",
            `text-${color}-800`
          )}
        >
          Reminders
        </h2>
        <button
          className={classNames(
            "h-5 w-5 transition duration-100",
            `text-${color}-800 hover:text-${color}-500`
          )}
          onClick={openModal}
        >
          <PlusIcon />
        </button>
      </header>
      <ul className="mt-10 h-[295px] space-y-3 overflow-y-scroll scrollbar-hide">
        {indexLoaderData.todos.map((todo) => (
          <Todo key={todo.id} {...todo} />
        ))}
      </ul>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Form method="post">
                    <div className="mb-5 flex flex-col space-y-2">
                      <label
                        htmlFor="todo"
                        className={classNames(
                          "select-none font-semibold",
                          `text-${color}-800`
                        )}
                      >
                        Todo
                      </label>
                      <input
                        type="text"
                        name="todo-text"
                        id="todo"
                        autoComplete="off"
                        className={classNames(
                          "h-11 rounded-md bg-gray-200 px-3",
                          `text-${color}-800 accent-${color}-800`
                        )}
                      />
                      {actionData?.fieldErrors?.todoText ? (
                        <InputError text={actionData.fieldErrors.todoText} />
                      ) : null}
                    </div>
                    <button
                      type="submit"
                      className={classNames(
                        "h-11 w-full rounded-lg px-4 font-bold text-white transition duration-100",
                        `bg-${color}-800 hover:bg-${color}-900`
                      )}
                    >
                      Submit
                    </button>
                  </Form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
