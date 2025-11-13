import { forwardRef } from 'react';

const VerticalList = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    className?: string;
  } & React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  // NOTE: to change max height, specify a different max-h-* class via className prop
  return (
    <div
      ref={ref}
      className={`flex flex-col space-y-2 overflow-y-scroll overflow-x-hidden max-h-60 py-2 pl-2 pr-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

VerticalList.displayName = 'VerticalList';

export default VerticalList;
