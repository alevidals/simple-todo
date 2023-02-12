import { classNames } from "~/utils/helpers";

type InputErrorProps = {
  text: string;
  className?: string;
};

export function InputError({ text, className }: InputErrorProps) {
  return (
    <p
      className={classNames(
        "text-xs font-medium text-red-600",
        className ?? ""
      )}
      role="alert"
    >
      {text}
    </p>
  );
}
