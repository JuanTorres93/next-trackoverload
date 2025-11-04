function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`border border-gray-300 py-1 px-4 rounded-lg text-lg ${className}`}
      {...props}
    />
  );
}

export default Input;
