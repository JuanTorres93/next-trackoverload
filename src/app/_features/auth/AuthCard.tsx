import Logo from "@/app/_ui/Logo";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  footer?: React.ReactNode;
}

function AuthCard({ children, title, subtitle, footer }: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      <div className="overflow-hidden shadow-2xl bg-surface-card rounded-2xl">
        {/* Gradient accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-primary-shade via-primary to-primary-light" />

        {/* Logo & brand */}
        <div className="flex flex-col items-center pt-8 pb-4">
          <Logo size={52} />
          <span className="mt-2 text-[11px] font-bold tracking-[0.25em] uppercase text-primary">
            Cimientos
          </span>
        </div>

        {/* Card body */}
        <div className="px-10 pb-10">
          <h2 className="text-2xl font-bold text-center text-text">{title}</h2>

          {subtitle && (
            <p className="mt-2 mb-6 text-sm text-center text-text-minor-emphasis">
              {subtitle}
            </p>
          )}

          <div className="mt-6">{children}</div>

          {footer && (
            <p className="mt-5 text-sm text-center text-text-minor-emphasis">
              {footer}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthCard;
