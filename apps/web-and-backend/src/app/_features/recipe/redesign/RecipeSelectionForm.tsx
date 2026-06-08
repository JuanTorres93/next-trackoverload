import { RecipeDTO } from "shared";
import { twMerge } from "tailwind-merge";

import ButtonAction from "@/app/_ui/buttons/ButtonAction";
import DateHeader from "@/app/app/(with-navbar)/meals/v2/DateHeader";

import RecipeSelector from "./RecipeSelector";

function RecipeSelectionForm({
  hasError,
  recipes,
  ...props
}: {
  hasError: boolean;
  recipes: RecipeDTO[];
} & React.FormHTMLAttributes<HTMLFormElement>) {
  const { className, ...rest } = props;

  return (
    <form
      className={twMerge(
        "grid grid-cols-1 grid-rows-[min-content_min-content_min-content_1fr] gap-3 h-full",
        className,
      )}
      {...rest}
    >
      <DateHeader />

      <section className="flex flex-col gap-4.5">
        <h2 className="text-[20px] font-semibold">
          Selecciona las comidas a registrar
        </h2>

        {hasError && (
          <span>
            Hubo un error al cargar tus recetas. Por favor, inténtalo de nuevo
            más tarde.
          </span>
        )}

        {!hasError && (
          <ul className="flex flex-col items-stretch gap-3">
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                <RecipeSelector recipe={recipe} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <ButtonAction className="self-end">Registrar comidas</ButtonAction>
    </form>
  );
}

export default RecipeSelectionForm;
