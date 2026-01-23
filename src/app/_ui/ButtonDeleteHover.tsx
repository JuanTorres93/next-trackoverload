import { HiTrash } from 'react-icons/hi';

function ButtonDeleteHover({
  className,
  ...props
}: { className?: string } & React.HTMLAttributes<HTMLButtonElement>) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    props.onClick?.(e);
  };

  return (
    <button
      className={`absolute z-10 p-1 transition bg-surface-card rounded-sm shadow-md top-2 right-2 hover:text-error ${className}`}
      {...props}
      onClick={handleClick}
    >
      <HiTrash />
    </button>
  );
}

export default ButtonDeleteHover;
