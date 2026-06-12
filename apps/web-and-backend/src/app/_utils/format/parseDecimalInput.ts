export function parseDecimalInput(value: string): number {
  if (!value) return 0;

  // keep only digits, dots and commas
  const cleaned = value.replace(/[^\d.,-]/g, "");

  const lastDot = cleaned.lastIndexOf(".");
  const lastComma = cleaned.lastIndexOf(",");

  let decimalSeparator: "." | "," | null = null;

  if (lastDot !== -1 && lastComma !== -1) {
    decimalSeparator = lastDot > lastComma ? "." : ",";
  } else if (lastDot !== -1) {
    decimalSeparator = ".";
  } else if (lastComma !== -1) {
    decimalSeparator = ",";
  }

  let normalized = cleaned;

  if (decimalSeparator) {
    const parts = cleaned.split(decimalSeparator);

    const integerPart = parts[0].replace(/[.,]/g, "");
    const decimalPart = parts.slice(1).join("");

    normalized =
      decimalPart.length > 0 ? `${integerPart}.${decimalPart}` : integerPart;
  } else {
    normalized = cleaned.replace(/[.,]/g, "");
  }

  const commasRemoved = normalized.replace(/,/g, "");

  const parsed = Number(commasRemoved);

  return Number.isFinite(parsed) ? parsed : 0;
}
