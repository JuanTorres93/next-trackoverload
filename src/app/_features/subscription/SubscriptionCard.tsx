'use client';

import { HiCheckCircle, HiSparkles } from 'react-icons/hi2';

import ButtonDanger from '@/app/_ui/buttons/ButtonDanger';
import ButtonPrimary from '@/app/_ui/buttons/ButtonPrimary';
import { UserDTO } from '@/application-layer/dtos/UserDTO';
import { formatPriceInEurCentsToString } from './formatPriceInEurCentsToString';

export type SubscriptionCardProps = {
  title: string;
  priceInEurCents: number;
  description: string;
  user: UserDTO;
  periodEndDate?: Date;
  onSubscribe?: () => void;
  onManagePayment?: () => void;
  onCancel?: () => void;
  onReactivate?: () => void;
};

function SubscriptionCard({
  title,
  priceInEurCents,
  description,
  user,
  periodEndDate,
  onSubscribe,
  onManagePayment,
  onCancel,
  onReactivate,
}: SubscriptionCardProps) {
  const { subscriptionStatus } = user;

  const formattedPrice = formatPriceInEurCentsToString(priceInEurCents);

  return (
    <div className="flex flex-col gap-4 p-6 bg-white shadow-md text-text-minor-emphasis rounded-xl w-80">
      <h2 className="text-2xl font-bold text-center text-text/80">{title}</h2>

      <HorizontalLine />
      {subscriptionStatus === 'active' ? (
        <ActiveSubscriptionContent
          periodEndDate={periodEndDate}
          onManagePayment={onManagePayment}
          onCancel={onCancel}
        />
      ) : subscriptionStatus === 'canceled' ? (
        <CanceledSubscriptionContent
          periodEndDate={periodEndDate}
          onReactivate={onReactivate}
        />
      ) : subscriptionStatus === 'free' ? (
        <FreeSubscriptionContent />
      ) : (
        <NoSubscriptionContent
          description={description}
          price={formattedPrice}
          onSubscribe={onSubscribe}
        />
      )}
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      data-testid="status-badge"
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
        active ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${active ? 'bg-primary' : 'bg-error'}`}
      />
      {active ? 'Activa' : 'Cancelada'}
    </span>
  );
}

function NoSubscriptionContent({
  description,
  price,
  onSubscribe,
}: {
  description: string;
  price: string;
  onSubscribe?: () => void;
}) {
  return (
    <>
      <p className="text-center text-text-regular">{description}</p>
      <HorizontalLine />
      <p className="font-medium text-center">
        Precio: <span className="text-text/80">{price}/mes</span>
      </p>
      <ButtonPrimary onClick={onSubscribe}>Suscribirme</ButtonPrimary>
    </>
  );
}

function ActiveSubscriptionContent({
  periodEndDate,
  onManagePayment,
  onCancel,
}: {
  periodEndDate?: Date;
  onManagePayment?: () => void;
  onCancel?: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="font-medium">Estado:</span>
        <StatusBadge active={true} />
      </div>
      {periodEndDate && (
        <p data-testid="period-end-date">
          Próximo pago:{' '}
          <span className="font-medium text-text/80">
            {formatDate(periodEndDate)}
          </span>
        </p>
      )}

      <HorizontalLine />

      <ButtonPrimary
        className="justify-center w-full"
        onClick={onManagePayment}
      >
        Gestionar suscripción
      </ButtonPrimary>
      <ButtonDanger className="justify-center w-full" onClick={onCancel}>
        Cancelar suscripción
      </ButtonDanger>
    </>
  );
}

function CanceledSubscriptionContent({
  periodEndDate,
  onReactivate,
}: {
  periodEndDate?: Date;
  onReactivate?: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="font-medium">Estado:</span>
        <StatusBadge active={false} />
      </div>
      {periodEndDate && (
        <p data-testid="period-end-date">
          Activa hasta:{' '}
          <span className="font-medium text-text/80">
            {formatDate(periodEndDate)}
          </span>
        </p>
      )}

      <HorizontalLine />

      <ButtonPrimary onClick={onReactivate}>
        Reactivar suscripción
      </ButtonPrimary>
    </>
  );
}

function FreeSubscriptionContent() {
  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <HiSparkles className="w-5 h-5 text-primary" />
        <span className="font-medium text-text/80">Suscripción gratuita</span>
      </div>

      <p className="text-center ">
        Puedes usar la aplicación sin preocuparte por pagos.
      </p>

      <HorizontalLine />

      <ul className="flex flex-col gap-2 text-sm">
        <li className="flex items-center gap-2">
          <HiCheckCircle className="w-4 h-4 text-primary" />
          <span>Acceso completo</span>
        </li>

        <li className="flex items-center gap-2">
          <HiCheckCircle className="w-4 h-4 text-primary" />
          <span>Sin compromiso ni pagos</span>
        </li>
      </ul>
    </>
  );
}

function formatDate(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleDateString('es-ES', { month: 'long' });
  return `${day} ${month.charAt(0).toUpperCase()}${month.slice(1)}`;
}

function HorizontalLine() {
  return <hr className="my-3 border-t border-text-minor-emphasis/20" />;
}

export default SubscriptionCard;
