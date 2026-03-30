'use client';

import { useState } from 'react';
import { useFormSetup } from '@/app/_hooks/useFormSetup';
import ButtonNew from '@/app/_ui/buttons/ButtonNew';
import FormEntry from '@/app/_ui/form/FormEntry';
import Input from '@/app/_ui/Input';
import { showErrorToast } from '@/app/_ui/showErrorToast';
import { JSENDResponse } from '@/app/_types/JSEND';
import { IngredientFinderResult } from '@/domain/services/IngredientFinder.port';
import BarcodeScanner from '../ingredient/ZXingBarcodeScanner';
import SpinnerMini from '@/app/_ui/SpinnerMini';
import { HiLockClosed } from 'react-icons/hi';
import TextSmall from '@/app/_ui/typography/TextSmall';
import { addFakeMealToDay } from './actions';

export type AddFakeMealFormState = {
  name: string;
  calories: string;
  protein: string;
  quantity: string;
};

const INITIAL_FORM_STATE: AddFakeMealFormState = {
  name: '',
  calories: '',
  protein: '',
  quantity: '100',
};

function AddFakeMealForm({
  dayId,
  onSuccess,
  submitAction,
  submitLabel = 'Añadir comida',
}: {
  dayId?: string;
  onSuccess?: () => void;
  submitAction?: (
    name: string,
    calories: number,
    protein: number,
  ) => Promise<void>;
  submitLabel?: string;
}) {
  const { formState, isLoading, setIsLoading, setField, resetForm } =
    useFormSetup<AddFakeMealFormState>(INITIAL_FORM_STATE);

  const [nutritionalInfoPer100g, setNutritionalInfoPer100g] =
    useState<NutritionalInfoPer100g | null>(null);

  const [isFetchingBarcode, setIsFetchingBarcode] = useState(false);

  const isLockedFromBarcode = nutritionalInfoPer100g !== null;

  function handleQuantityChange(newQuantity: string) {
    setField('quantity', newQuantity);

    if (nutritionalInfoPer100g && newQuantity.trim() !== '') {
      const qty = Number(newQuantity);

      if (!isNaN(qty) && qty >= 0) {
        const computed = computeNutritionalValues(nutritionalInfoPer100g, qty);

        setField('calories', computed.calories);
        setField('protein', computed.protein);
      }
    }
  }

  async function onScanResult(result: string | null) {
    if (!result) return;

    setIsFetchingBarcode(true);

    try {
      const response = await fetch(`/api/ingredient/barcode/${result}`);
      const jsendResponse: JSENDResponse<IngredientFinderResult[]> =
        await response.json();

      if (
        jsendResponse.status !== 'success' ||
        jsendResponse.data.length === 0
      ) {
        showErrorToast(
          'No se encontró ningún producto para este código de barras.',
        );
        return;
      }

      const firstResult = jsendResponse.data[0];
      const { name, nutritionalInfoPer100g: info } = firstResult.ingredient;
      const qty = Number(formState.quantity) || 100;
      const computed = computeNutritionalValues(info, qty);

      setField('name', name);
      setField('calories', computed.calories);
      setField('protein', computed.protein);
      setNutritionalInfoPer100g(info);
    } catch {
      showErrorToast('Error al leer el código de barras. Inténtalo de nuevo.');
    } finally {
      setIsFetchingBarcode(false);
    }
  }

  async function onScanError() {
    showErrorToast(
      'Error al escanear el código de barras. Inténtalo de nuevo.',
    );
  }

  const invalidForm =
    formState.name.trim() === '' ||
    formState.calories.trim() === '' ||
    formState.protein.trim() === '' ||
    Number(formState.calories) < 0 ||
    Number(formState.protein) < 0 ||
    isLoading ||
    isFetchingBarcode;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (invalidForm) return;

    setIsLoading(true);

    try {
      const calories = Number(formState.calories);
      const protein = Number(formState.protein);

      if (submitAction) {
        await submitAction(formState.name, calories, protein);
      } else {
        await addFakeMealToDay(dayId!, formState.name, calories, protein);
      }

      resetForm();
      setNutritionalInfoPer100g(null);
      onSuccess?.();
    } catch {
      showErrorToast(
        'Error al añadir la comida. Por favor, inténtalo de nuevo.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div>
        <h3 className="text-base font-semibold text-text">Entrada rápida</h3>
        <p className="text-sm text-text-minor-emphasis">
          Añade una comida con sus macros directamente
        </p>
      </div>

      {/* Name field with barcode button — custom layout to keep label pointing to input */}
      <div className="flex flex-col gap-2">
        <label htmlFor="fake-meal-name">
          <TextSmall className="font-input font-medium text-label leading-5.25">
            Nombre de la comida
          </TextSmall>
        </label>
        <div className="flex items-center gap-2">
          <Input
            id="fake-meal-name"
            value={formState.name}
            placeholder="Nombre de la comida"
            onChange={(e) => setField('name', e.target.value)}
            containerClassName="flex-1"
          />
          {isFetchingBarcode ? (
            <div className="p-2.5">
              <SpinnerMini />
            </div>
          ) : (
            <BarcodeScanner
              onScanResult={onScanResult}
              onScanError={onScanError}
            >
              <BarcodeScanner.ZXing />
            </BarcodeScanner>
          )}
        </div>
      </div>

      {isLockedFromBarcode && (
        <div className="flex flex-col gap-2">
          <FormEntry labelText="Cantidad (g)" htmlFor="fake-meal-quantity">
            <Input
              id="fake-meal-quantity"
              type="number"
              placeholder="100"
              value={formState.quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
            />
          </FormEntry>
          <div className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-text-minor-emphasis bg-surface-light">
            <HiLockClosed size={12} />
            <span>
              Calorías y proteínas calculadas automáticamente según la cantidad
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <FormEntry labelText="Calorías" htmlFor="fake-meal-calories">
          <Input
            id="fake-meal-calories"
            type="number"
            placeholder="Calorías"
            value={formState.calories}
            onChange={(e) => setField('calories', e.target.value)}
            disabled={isLockedFromBarcode}
          />
        </FormEntry>

        <FormEntry labelText="Proteínas (g)" htmlFor="fake-meal-proteins">
          <Input
            id="fake-meal-proteins"
            type="number"
            placeholder="Proteínas"
            value={formState.protein}
            onChange={(e) => setField('protein', e.target.value)}
            disabled={isLockedFromBarcode}
          />
        </FormEntry>
      </div>

      <ButtonNew
        type="submit"
        className="mt-2"
        isLoading={isLoading}
        disabled={invalidForm}
      >
        {submitLabel}
      </ButtonNew>
    </form>
  );
}

type NutritionalInfoPer100g = {
  calories: number;
  protein: number;
};

function computeNutritionalValues(
  nutritionalInfoPer100g: NutritionalInfoPer100g,
  quantity: number,
) {
  return {
    calories: Math.round(
      (nutritionalInfoPer100g.calories * quantity) / 100,
    ).toString(),
    protein: Math.round(
      (nutritionalInfoPer100g.protein * quantity) / 100,
    ).toString(),
  };
}

export default AddFakeMealForm;
