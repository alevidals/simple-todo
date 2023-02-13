import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Form, useLoaderData } from "@remix-run/react";
import { Fragment, useState } from "react";
import type { loader } from "~/root";
import { classNames } from "~/utils/helpers";

type TodoProps = {
  id: string;
  text: string;
};

export function Todo({ id, text }: TodoProps) {
  const rootLoader = useLoaderData<typeof loader>();

  const [isOpen, setIsOpen] = useState(false);

  const color = rootLoader.user?.ProfileConfiguration?.colorTheme;

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <li
      className={classNames(
        "group flex items-center justify-between py-2",
        `text-${color}-800`
      )}
    >
      <span>{text}</span>
      <button
        className={classNames(
          "invisible group-hover:visible",
          `text-${color}-500 hover:text-${color}-800`
        )}
        onClick={openModal}
      >
        <XMarkIcon className="h-5 w-5 " />
      </button>
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
                <Dialog.Panel className="flex w-full max-w-md transform flex-col space-y-3 overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className={classNames(
                      "text-lg font-medium leading-6",
                      `text-${color}-800`
                    )}
                  >
                    Are you sure you want to delete this todo?
                  </Dialog.Title>
                  <p className={classNames("font-light", `text-${color}-600`)}>
                    {text}
                  </p>
                  <Form
                    method="delete"
                    className="flex items-center justify-end space-x-4"
                  >
                    <button
                      type="button"
                      className={classNames(
                        "h-9 rounded-lg  px-4 font-bold text-white transition duration-100",
                        `bg-${color}-800 hover:bg-${color}-900`
                      )}
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      name="id"
                      value={id}
                      className="h-9 rounded-lg bg-red-800 px-4 font-bold text-white transition duration-100 hover:bg-red-900"
                    >
                      Delete
                    </button>
                  </Form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </li>
  );
}
