import { TodoTable } from "~/components/TodoTable";

export default function Index() {
  return (
    <main className="container mx-auto mt-10">
      <h1 className="mb-10 text-3xl font-bold text-slate-800">Todo</h1>
      <TodoTable />
    </main>
  );
}
