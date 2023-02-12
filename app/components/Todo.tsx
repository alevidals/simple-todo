import { XMarkIcon } from "@heroicons/react/20/solid";
import { Form } from "@remix-run/react";

type TodoProps = {
  id: string;
  text: string;
};

export function Todo({ id, text }: TodoProps) {
  return (
    <li className="group flex items-center justify-between py-2 text-slate-800">
      <span>{text}</span>
      <Form method="delete">
        <button
          type="submit"
          name="id"
          value={id}
          className="invisible text-slate-500 hover:text-slate-800 group-hover:visible"
        >
          <XMarkIcon className="h-5 w-5 " />
        </button>
      </Form>
    </li>
  );
}
