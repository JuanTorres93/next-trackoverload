import { FiPlus } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

function ButtonPlus({ ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <button
      className={twMerge("p-2.5 bg-white rounded-full", className)}
      {...rest}
    >
      <FiPlus size={22} />
    </button>
  );
}

export default ButtonPlus;
