import { getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";

async function CopyrightNote({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const t = await getTranslations("LandingPage");

  return (
    <div
      className={twMerge(
        "text-center text-xs py-4 border-t border-white",
        className,
      )}
      {...rest}
    >
      &copy; {new Date().getFullYear()} Cimientos. {t("footer.copyright")}
    </div>
  );
}

export default CopyrightNote;
