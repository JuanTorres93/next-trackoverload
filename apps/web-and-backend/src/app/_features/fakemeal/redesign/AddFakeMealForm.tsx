import { twMerge } from "tailwind-merge";

import ButtonAction from "@/app/_ui/buttons/ButtonAction";
import FormLabelInput from "@/app/_ui/form/redesign/FormLabelInput";
import MenuFromBottom from "@/app/_ui/menus/MenuFromBottom";
import Input from "@/app/_ui/user-input/Input";

function AddFakeMealForm({
  show,
  ...props
}: { show: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <MenuFromBottom
      title="Añadir comida rápida"
      show={show}
      className={twMerge("", className)}
      {...rest}
    >
      <form className="flex flex-col gap-3.75" action="">
        <FormLabelInput label="Nombre de la comida" htmlFor="fake-meal-name">
          <Input id="fake-meal-name" placeholder="ej: Batido de proteínas" />
        </FormLabelInput>

        <div className="flex gap-3.75">
          <FormLabelInput label="Calorías" htmlFor="fake-meal-calories">
            <Input id="fake-meal-calories" placeholder="ej: 250" />
          </FormLabelInput>

          <FormLabelInput label="Proteínas (g)" htmlFor="fake-meal-proteins">
            <Input id="fake-meal-proteins" placeholder="ej: 25" />
          </FormLabelInput>
        </div>

        <div></div>

        <ButtonAction>Guardar</ButtonAction>
      </form>
    </MenuFromBottom>
  );
}

export default AddFakeMealForm;
