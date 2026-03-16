'use client';

import { HiCheckCircle, HiSparkles } from 'react-icons/hi2';

import ButtonDanger from '@/app/_ui/buttons/ButtonDanger';
import ButtonPrimary from '@/app/_ui/buttons/ButtonPrimary';
import { UserDTO } from '@/application-layer/dtos/UserDTO';
import { formatPriceInEurCentsToString } from './formatPriceInEurCentsToString';
import { useState } from 'react';
import SpinnerMini from '@/app/_ui/SpinnerMini';

export type SubscriptionCardProps = {
  title: string;
  priceInEurCents: number;
  description: string;
  user: UserDTO;
};

function SubscriptionCard({
  title,
  priceInEurCents,
  description,
  user,
}: SubscriptionCardProps) {
  const { subscriptionStatus, subscriptionEndsAt } = user;

  const periodEndDate = subscriptionEndsAt
    ? new Date(subscriptionEndsAt)
    : undefined;
  const formattedPrice = formatPriceInEurCentsToString(priceInEurCents);

  return (
    <div className="flex flex-col gap-4 p-6 bg-white shadow-md text-text-minor-emphasis rounded-xl w-80">
      <h2 className="text-2xl font-bold text-center text-text/80">{title}</h2>

      <HorizontalLine />
      {subscriptionStatus === 'active' ? (
        <ActiveSubscriptionContent periodEndDate={periodEndDate} />
      ) : subscriptionStatus === 'canceled' ? (
        <CanceledSubscriptionContent periodEndDate={periodEndDate} />
      ) : subscriptionStatus === 'free' ? (
        <FreeSubscriptionContent />
      ) : (
        <NoSubscriptionContent
          description={description}
          price={formattedPrice}
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
}: {
  description: string;
  price: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
      });
      const json = await response.json();

      if (json.status === 'success') {
        window.location.assign(json.data.redirectUrl);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <p className="text-center text-text-regular">{description}</p>
      <HorizontalLine />
      <p className="font-medium text-center">
        Precio: <span className="text-text/80">{price}/mes</span>
      </p>
      <ButtonPrimary disabled={isLoading} onClick={handleSubscribe}>
        {!isLoading && 'Suscribirme'}
        {isLoading && <SpinnerMini className="mx-auto" />}
      </ButtonPrimary>
    </>
  );
}

function ActiveSubscriptionContent({
  periodEndDate,
}: {
  periodEndDate?: Date;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
      });
      const json = await response.json();

      if (json.status === 'success') {
        window.location.assign(json.data.redirectUrl);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

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

      <ButtonDanger
        className="justify-center w-full"
        disabled={isLoading}
        onClick={handleCancel}
      >
        {!isLoading && 'Cancelar suscripción'}
        {isLoading && <SpinnerMini className="mx-auto" />}
      </ButtonDanger>
    </>
  );
}

function CanceledSubscriptionContent({
  periodEndDate,
}: {
  periodEndDate?: Date;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleResume = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/subscription/resume', {
        method: 'POST',
      });
      const json = await response.json();

      if (json.status === 'success') {
        window.location.assign(json.data.redirectUrl);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

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

      <ButtonPrimary disabled={isLoading} onClick={handleResume}>
        {!isLoading && 'Reactivar suscripción'}
        {isLoading && <SpinnerMini className="mx-auto" />}
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
