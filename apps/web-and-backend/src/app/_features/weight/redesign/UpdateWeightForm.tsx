"use client";

import { twMerge } from "tailwind-merge";

import { useFormSetup } from "@/app/_hooks/useFormSetup";
import ButtonAction from "@/app/_ui/buttons/ButtonAction";
import FormLabelInput from "@/app/_ui/form/redesign/FormLabelInput";
import MenuFromBottom from "@/app/_ui/menus/MenuFromBottom";
import Input from "@/app/_ui/user-input/Input";
import { parseDecimalInput } from "@/app/_utils/format/parseDecimalInput";

import { updateUserWeightForDay } from "../../day/actions";
import { getTodayDayId } from "../../day/utils/getTodayDayId";

export type UpdateWeightFormState = {
  weightInKg: string;
};

const INITIAL_FORM_STATE: UpdateWeightFormState = {
  weightInKg: "",
};

function UpdateWeightForm({
  show = false,
  onClose,
  ...props
}: {
  show?: boolean;
  onClose?: () => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const { formState, setField, isLoading, resetForm, setIsLoading } =
    useFormSetup<UpdateWeightFormState>(INITIAL_FORM_STATE);

  const disableSubmit = !formState.weightInKg || isLoading;

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setIsLoading(true);

      const todayId = getTodayDayId();

      const parsedWeight = parseDecimalInput(formState.weightInKg);

      await updateUserWeightForDay(todayId, parsedWeight);

      onClose?.();
      resetForm();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <MenuFromBottom
      title="Actualizar peso"
      show={show}
      onClose={onClose}
      className={twMerge("", className)}
      {...rest}
    >
      <form className="flex flex-col gap-6.5" onSubmit={handleSubmit}>
        <FormLabelInput label="Peso actual" htmlFor="current-weight">
          <Input
            id="current-weight"
            placeholder="Introduce tu peso"
            value={formState.weightInKg}
            onChange={(e) => setField("weightInKg", e.target.value)}
            autoFocus
          />
        </FormLabelInput>

        <ButtonAction disabled={disableSubmit}>Guardar</ButtonAction>
      </form>
    </MenuFromBottom>
  );
}

export default UpdateWeightForm;
