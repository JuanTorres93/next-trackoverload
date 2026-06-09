import { twMerge } from "tailwind-merge";

function MealSelectionSection({
  sectionTitle,
  hasError,
  children,
  ...props
}: {
  sectionTitle: string;
  hasError: boolean;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLUListElement>) {
  const { className, ...rest } = props;

  return (
    <section className="grid grid-cols-1 grid-rows-[min-content_1fr] gap-4.5 overflow-hidden">
      <h2 className="text-[20px] font-semibold">{sectionTitle}</h2>

      {hasError && (
        <span>
          Hubo un error al cargar tus recetas. Por favor, inténtalo de nuevo más
          tarde.
        </span>
      )}

      {!hasError && (
        <ul
          className={twMerge(
            "flex flex-col items-stretch gap-3 overflow-y-scroll",
            className,
          )}
          {...rest}
        >
          {children}
        </ul>
      )}
    </section>
  );
}

export default MealSelectionSection;
