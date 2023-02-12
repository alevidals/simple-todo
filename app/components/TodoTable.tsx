import { PlusIcon } from "@heroicons/react/20/solid";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { action, loader } from "~/routes";
import { InputError } from "./InputError";
import { Todo } from "./Todo";

export function TodoTable() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div className="h-[450px] rounded-md bg-gray-100 p-10 shadow-2xl">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800 md:text-2xl">
          Reminders
        </h2>
        <button
          className="h-5 w-5 text-slate-800 transition duration-100 hover:text-slate-500"
          onClick={openModal}
        >
          <PlusIcon />
        </button>
      </header>
      <ul className="mt-10 h-[295px] space-y-3 overflow-y-scroll scrollbar-hide">
        {loaderData.todos.map((todo, index) => (
          <Todo key={todo.id} {...todo} />
        ))}
      </ul>
      {/*  */}
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
                        className="select-none font-semibold text-slate-800"
                      >
                        Todo
                      </label>
                      <input
                        type="text"
                        name="todo-text"
                        id="todo"
                        autoComplete="off"
                        className="h-11 rounded-md bg-gray-200 px-3 text-slate-800 accent-slate-800"
                      />
                      {actionData?.fieldErrors?.todoText ? (
                        <InputError text={actionData.fieldErrors.todoText} />
                      ) : null}
                    </div>
                    <button
                      type="submit"
                      className="h-11 w-full rounded-lg bg-slate-800 px-4 font-bold text-white transition duration-100 hover:bg-slate-900"
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
    // <div className="bg-green-500 h-[450px] rounded-md shadow-2xl grid grid-cols-4 overflow-hidden">
    //   <div className="bg-blue-400"></div>
    //   <div className="bg-red-400 col-span-3"></div>
    // </div>
  );
}
