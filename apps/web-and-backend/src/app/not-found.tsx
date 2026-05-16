import ButtonPrimary from './_ui/buttons/ButtonPrimary';
import StatusPage from './_ui/StatusPage';

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="Esta página no está disponible"
      description="Puede que el enlace ya no exista o que la dirección no sea correcta. Si quieres, puedes volver al dashboard y seguir desde ahí."
      accentClassName="text-primary"
      actions={<ButtonPrimary href="/app">Ir al dashboard</ButtonPrimary>}
    />
  );
}
