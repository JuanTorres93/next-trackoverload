import { twMerge } from "tailwind-merge";

import ButtonAction from "@/app/_ui/buttons/ButtonAction";
import FormLabelInput from "@/app/_ui/form/redesign/FormLabelInput";
import MenuFromBottom from "@/app/_ui/menus/MenuFromBottom";
import Input from "@/app/_ui/user-input/Input";

function UpdateGoalsForm({
  show = false,
  ...props
}: { show: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <MenuFromBottom
      title="Actualizar objetivos"
      show={show}
      className={twMerge("", className)}
      {...rest}
    >
      <form className="flex flex-col gap-6.5" action="">
        <div className="flex flex-col gap-3.75">
          <FormLabelInput label="Objetivo de calorías" htmlFor="calories-goal">
            <Input id="calories-goal" placeholder="ej: 2000" />
          </FormLabelInput>

          <FormLabelInput
            label="Objetivo de proteínas (g)"
            htmlFor="protein-goal"
          >
            <Input id="protein-goal" placeholder="ej: 150" />
          </FormLabelInput>
        </div>

        <ButtonAction>Guardar</ButtonAction>
      </form>
    </MenuFromBottom>
  );
}

export default UpdateGoalsForm;
