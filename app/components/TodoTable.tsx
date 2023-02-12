import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Form } from "@remix-run/react";

type Todo = {
  id: string;
  text: string;
};

type TodoTableProps = {
  todos: Todo[];
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function TodoTable({ todos }: TodoTableProps) {
  return (
    <div className="h-[450px] overflow-y-scroll rounded-md bg-gray-100 p-10 shadow-2xl">
      <header className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-slate-800">Reminders</h2>
        <button className="h-5 w-5 text-slate-800 transition duration-100 hover:text-slate-500">
          <PlusIcon />
        </button>
      </header>
      <ul className="mt-10 space-y-3">
        {todos.map((todo, index) => (
          <li
            key={todo.id}
            className={classNames(
              "group flex items-center justify-between py-2 text-slate-800"
            )}
          >
            <span>{todo.text}</span>
            <Form method="delete">
              <button
                type="submit"
                name="id"
                value={todo.id}
                className="invisible text-slate-500 hover:text-slate-800 group-hover:visible"
              >
                <XMarkIcon className="h-5 w-5 " />
              </button>
            </Form>
          </li>
        ))}
      </ul>
    </div>
    // <div className="bg-green-500 h-[450px] rounded-md shadow-2xl grid grid-cols-4 overflow-hidden">
    //   <div className="bg-blue-400"></div>
    //   <div className="bg-red-400 col-span-3"></div>
    // </div>
  );
}
