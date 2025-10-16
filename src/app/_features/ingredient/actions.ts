'use server';
import { AppCreateIngredientUsecase } from '@/interface-adapters/app/use-cases/ingredient/CreateIngredient/createingredient';
import { FormState } from '@/app/_types/FormState';

export async function createIngredient(
  initialState: FormState, // Unsed, but needed for useActionState
  formData: FormData
) {
  const finalFormState: FormState = {
    ok: false,
    errors: {},
    message: null,
  };

  const name = String(formData.get('name') || '').trim();
  const calories = Number(formData.get('calories') || 0);
  const protein = Number(formData.get('protein') || 0);

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'El nombre es obligatorio';
  if (Number.isNaN(calories) || calories <= 0)
    errors.calories = 'Calorías debe ser mayor de cero';
  if (Number.isNaN(protein) || protein <= 0)
    errors.protein = 'Proteínas debe ser mayor de cero';

  if (Object.keys(errors).length > 0) {
    finalFormState.errors = errors;
    finalFormState.message = 'Revisa los campos';
    return finalFormState;
  }

  try {
    await AppCreateIngredientUsecase.execute({
      name,
      calories,
      protein,
    });
  } catch {
    finalFormState.message = 'Error al crear el ingrediente';
    return finalFormState;
  }

  finalFormState.ok = true;
  finalFormState.message = 'Ingrediente creado';
  return finalFormState;
}
