import { format } from "date-fns";
import { es } from "date-fns/locale";

export function formatDateRange(from: Date, to: Date) {
  const areSameMonth =
    from.getMonth() === to.getMonth() &&
    from.getFullYear() === to.getFullYear();

  const areSameDay = from.getDate() === to.getDate() && areSameMonth;

  if (areSameDay) {
    return format(from, "d 'de' MMMM 'de' yyyy", { locale: es });
  }

  // ej: 18 al 24 de junio de 2024
  // ej: 28 de mayo al 2 de junio de 2024
  return areSameMonth
    ? `${format(from, "d", { locale: es })} al ${format(
        to,
        "d 'de' MMMM 'de' yyyy",
        { locale: es },
      )}`
    : `${format(from, "d 'de' MMMM", { locale: es })} al ${format(
        to,
        "d 'de' MMMM 'de' yyyy",
        { locale: es },
      )}`;
}
