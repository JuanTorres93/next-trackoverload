import { IngredientFinderResult } from '@/domain/services/IngredientFinder.port';
import BarcodeScanner from './ZXingBarcodeScanner';
import { useState } from 'react';

function IngredientBarcodeSearch() {
  const [foundIngredientsResults, setFoundIngredientsResults] = useState<
    IngredientFinderResult[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  async function onScanResult(result: string | null) {
    // TODO DELETE THESE DEBUG LOGS
    console.log('CALLBACK');

    // TODO DELETE THESE DEBUG LOGS
    console.log('result');
    console.log(result);

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

        // TODO DELETE THESE DEBUG LOGS
        console.log('data');
        console.log(data);

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
