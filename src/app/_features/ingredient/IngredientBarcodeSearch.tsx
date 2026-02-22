import { IngredientFinderResult } from '@/domain/services/IngredientFinder.port';
import BarcodeScanner from './ZXingBarcodeScanner';
import { useState } from 'react';

function IngredientBarcodeSearch({
  onIngredientFound,
}: {
  onIngredientFound?: (ingredient: IngredientFinderResult) => void;
}) {
  const [foundIngredientsResults, setFoundIngredientsResults] = useState<
    IngredientFinderResult[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  async function onScanResult(result: string | null) {
    if (result) {
      // TODO handle scanned barcode result, e.g. by searching for the ingredient and allowing the user to add it to the recipe
      setIsLoading(true);

      console.log('BUSCAR EN API');
      console.log('Scanned barcode:', result);

      const fetchedIngredientsResult: Response = await fetch(
        `/api/ingredient/barcode/${result}`,
      );

      try {
        const data: IngredientFinderResult[] =
          await fetchedIngredientsResult.json();

        onIngredientFound?.(data[0]);
        setFoundIngredientsResults(data);
      } catch {
        setFoundIngredientsResults([]);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <div>
      <BarcodeScanner onScanResult={onScanResult}>
        <BarcodeScanner.ZXing />
      </BarcodeScanner>
    </div>
  );
}

export default IngredientBarcodeSearch;
