export type FormState = {
  ok: boolean;
  errors: Record<string, string>;
  message?: string | null;
};
