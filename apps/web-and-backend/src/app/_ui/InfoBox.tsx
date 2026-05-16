import { twMerge } from 'tailwind-merge';

function InfoBox({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge('p-4 rounded bg-info/30', className)} {...rest}>
      {children}
    </div>
  );
}

export default InfoBox;
