import { format } from "date-fns";
import { es } from "date-fns/locale/es";

export function formatDate(date: Date) {
  return format(date, "d MMMM, yyyy", { locale: es });
}
