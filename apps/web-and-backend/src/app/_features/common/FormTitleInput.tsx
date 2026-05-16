import { twMerge } from "tailwind-merge";

function FormTitleTextArea({
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;

  return (
    <textarea
      className={twMerge(
        "w-full text-lg font-bold leading-snug bg-transparent outline-none resize-none text-text placeholder:text-text-minor-emphasis",
        className,
      )}
      rows={2}
      spellCheck={false}
      {...rest}
    />
  );
}

export default FormTitleTextArea;
