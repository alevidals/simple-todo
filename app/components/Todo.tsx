import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Form } from "@remix-run/react";
import { Fragment, useState } from "react";

type TodoProps = {
  id: string;
  text: string;
};

export function Todo({ id, text }: TodoProps) {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <li className="group flex items-center justify-between py-2 text-slate-800">
      <span>{text}</span>
      <button
        className="invisible text-slate-500 hover:text-slate-800 group-hover:visible"
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
                    className="text-lg font-medium leading-6 text-slate-800"
                  >
                    Are you sure you want to delete this todo?
                  </Dialog.Title>
                  <p className="font-light text-slate-600">{text}</p>
                  <Form
                    method="delete"
                    className="flex items-center justify-end space-x-4"
                  >
                    <button
                      type="button"
                      className="h-9 rounded-lg bg-slate-800 px-4 font-bold text-white transition duration-100 hover:bg-slate-900"
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
