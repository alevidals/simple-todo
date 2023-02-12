type HeaderProps = {
  username?: string;
};

export function Header({ username }: HeaderProps) {
  return (
    <header className="mb-10 flex items-center justify-between space-x-5">
      <h1 className="text-3xl font-bold text-slate-800">Simple Todo</h1>
      <div className="flex items-center space-x-5">
        <span className="font-medium text-slate-800">{`Hi ${username}`}</span>
        <form action="/logout" method="post">
          <button
            type="submit"
            className="h-9 w-full rounded-lg bg-slate-800 px-4 font-bold text-white transition duration-100 hover:bg-slate-900"
          >
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}
