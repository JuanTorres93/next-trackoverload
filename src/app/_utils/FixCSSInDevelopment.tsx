import Script from "next/script";

function FixCSSInDevelopment() {
  return (
    <>
      {/* Unregister any stale service workers that may cache outdated CSS/JS */}
      {process.env.NODE_ENV === "development" && (
        <Script id="sw-cleanup" strategy="afterInteractive">{`
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(function(registrations) {
                registrations.forEach(function(r) { r.unregister(); });
              });
            }
          `}</Script>
      )}
    </>
  );
}

export default FixCSSInDevelopment;
