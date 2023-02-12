export function InputError({ text }: { text: string }) {
  return (
    <p className="text-xs font-medium text-red-600" role="alert">
      {text}
    </p>
  );
}
