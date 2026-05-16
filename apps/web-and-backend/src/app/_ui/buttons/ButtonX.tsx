import { HiOutlineX } from 'react-icons/hi';

function ButtonX({ ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;
  return (
    <button
      type="button"
      {...rest}
      className={`text-xl cursor-pointer text-text-minor-emphasis hover:text-error ${className ?? ''}`}
    >
      <HiOutlineX />
    </button>
  );
}

export default ButtonX;
