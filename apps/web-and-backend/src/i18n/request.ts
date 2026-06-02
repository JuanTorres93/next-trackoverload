import { getRequestConfig } from "next-intl/server";

// TODO: Create a script in web-and-backend to ensure that all locales have the same keys and run it in the pre-commit hook

export default getRequestConfig(async () => {
  // Static for now, we'll change this later
  const locale = "es";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
