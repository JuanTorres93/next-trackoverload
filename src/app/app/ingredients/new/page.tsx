import Input from '@/app/_ui/Input';
import Form from '@/app/_ui/NewResourceForm';

export const metadata = {
  title: 'New Ingredient',
  description: 'Create a new ingredient',
};

export default function NewIngredientPage() {
  return (
    <Form submitText="Crear ingrediente">
      <Form.FormRow label="Nombre">
        <Input id="nombre" placeholder="Nombre del ingrediente" required />
      </Form.FormRow>

      <Form.FormRow label="Calorías">
        <Input id="calorias" placeholder="Calorías del ingrediente" />
      </Form.FormRow>

      <Form.FormRow label="Proteínas">
        <Input id="proteinas" placeholder="Proteínas del ingrediente" />
      </Form.FormRow>
    </Form>
  );
}
