import Input from '@/app/_ui/Input';
import Form from '@/app/_ui/NewResourceForm';
import { createIngredient } from './actions';

function NewIngredientForm() {
  return (
    <Form action={createIngredient} submitText="Crear ingrediente">
      <Form.FormRow label="Nombre">
        <Input name="name" placeholder="Nombre del ingrediente" required />
      </Form.FormRow>

      <Form.FormRow label="Calorías">
        <Input name="calories" placeholder="Calorías del ingrediente" />
      </Form.FormRow>

      <Form.FormRow label="Proteínas">
        <Input name="protein" placeholder="Proteínas del ingrediente" />
      </Form.FormRow>
    </Form>
  );
}

export default NewIngredientForm;
