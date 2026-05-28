import { twMerge } from "tailwind-merge";

function Footer({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <footer
      className={twMerge("flex flex-col bg-text mt-15 text-white", className)}
      {...rest}
    >
      <div className={twMerge("mx-auto max-w-400 py-10", className)}>
        CONTENIDO
      </div>

      <div
        className={twMerge("text-center py-4 border-t border-white", className)}
      >
        &copy; {new Date().getFullYear()} cimientos.app All rights reserved
      </div>
    </footer>
  );
}

export default Footer;
