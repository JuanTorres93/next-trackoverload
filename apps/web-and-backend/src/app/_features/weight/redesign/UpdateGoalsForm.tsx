"use client";

import { twMerge } from "tailwind-merge";

import { useFormSetup } from "@/app/_hooks/useFormSetup";
import ButtonAction from "@/app/_ui/buttons/ButtonAction";
import FormLabelInput from "@/app/_ui/form/redesign/FormLabelInput";
import MenuFromBottom from "@/app/_ui/menus/MenuFromBottom";
import Input from "@/app/_ui/user-input/Input";
import { parseDecimalInput } from "@/app/_utils/format/parseDecimalInput";

import { setCaloriesGoalForDay, setProteinGoalForDay } from "../../day/actions";
import { getTodayDayId } from "../../day/utils/getTodayDayId";

export type UpdateCaloriesFormState = {
  newCalories: string;
  newProtein: string;
};

const INITIAL_FORM_STATE: UpdateCaloriesFormState = {
  newCalories: "",
  newProtein: "",
};

function UpdateGoalsForm({
  show = false,
  onClose,
  ...props
}: {
  show?: boolean;
  onClose?: () => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const { formState, setField, isLoading, resetForm, setIsLoading } =
    useFormSetup<UpdateCaloriesFormState>(INITIAL_FORM_STATE);

  const disableSubmit =
    isLoading || (!formState.newCalories && !formState.newProtein);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setIsLoading(true);

      const todayId = getTodayDayId();

      const parsedCalories = Math.round(
        parseDecimalInput(formState.newCalories),
      );

      const parsedProtein = Math.round(parseDecimalInput(formState.newProtein));

      const promises = [
        formState.newCalories
          ? setCaloriesGoalForDay(todayId, parsedCalories)
          : Promise.resolve(),

        formState.newProtein
          ? setProteinGoalForDay(todayId, parsedProtein)
          : Promise.resolve(),
      ];

      await Promise.all(promises);

      onClose?.();
      resetForm();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <MenuFromBottom
      title="Actualizar objetivos"
      show={show}
      onClose={onClose}
      className={twMerge("", className)}
      {...rest}
    >
      <form className="flex flex-col gap-6.5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3.75">
          <FormLabelInput label="Objetivo de calorías" htmlFor="calories-goal">
            <Input
              id="calories-goal"
              placeholder="ej: 2000"
              value={formState.newCalories}
              onChange={(e) => setField("newCalories", e.target.value)}
            />
          </FormLabelInput>

          <FormLabelInput
            label="Objetivo de proteínas (g)"
            htmlFor="protein-goal"
          >
            <Input
              id="protein-goal"
              placeholder="ej: 150"
              value={formState.newProtein}
              onChange={(e) => setField("newProtein", e.target.value)}
            />
          </FormLabelInput>
        </div>

        <ButtonAction disabled={disableSubmit}>Guardar</ButtonAction>
      </form>
    </MenuFromBottom>
  );
}

export default UpdateGoalsForm;
