import { IngredientFinderResult } from '@/domain/services/IngredientFinder.port';
import BarcodeScanner from './ZXingBarcodeScanner';
import { useState } from 'react';
import Spinner from '@/app/_ui/Spinner';

function IngredientBarcodeSearch({
  onIngredientFound,
  onIngredientNotFound,
}: {
  onIngredientFound?: (ingredient: IngredientFinderResult) => void;
  onIngredientNotFound?: () => void;
}) {
  const [foundIngredientsResults, setFoundIngredientsResults] = useState<
    IngredientFinderResult[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  async function onScanResult(result: string | null) {
    if (result) {
      setIsLoading(true);

      console.log('Searching in food API');
      console.log('Scanned barcode:', result);

      const fetchedIngredientsResult: Response = await fetch(
        `/api/ingredient/barcode/${result}`,
      );

      try {
        const data: IngredientFinderResult[] =
          await fetchedIngredientsResult.json();

        setFoundIngredientsResults(data);
        onIngredientFound?.(data[0]);
      } catch {
        setFoundIngredientsResults([]);
        onIngredientNotFound?.();
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function onScanError() {
    setFoundIngredientsResults([]);
    onIngredientNotFound?.();
  }

  return (
    <div>
      <BarcodeScanner onScanResult={onScanResult} onScanError={onScanError}>
        <BarcodeScanner.ZXing />

        {isLoading && <Spinner />}
      </BarcodeScanner>
    </div>
  );
}

export default IngredientBarcodeSearch;
