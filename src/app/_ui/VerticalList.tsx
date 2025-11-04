function VerticalList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  // NOTE: to change max height, specify a different max-h-* class via className prop
  return (
    <div
      className={`flex flex-col space-y-2 overflow-y-scroll overflow-x-hidden max-h-60 py-2 pl-2 pr-4 ${className}`}
    >
      {children}
    </div>
  );
}

export default VerticalList;
