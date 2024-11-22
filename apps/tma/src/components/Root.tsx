// apps/tma/src/components/Root.tsx

import { SDKProvider, useLaunchParams } from "@tma.js/sdk-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { type FC, useEffect } from "react";

import { ErrorBoundary } from "@/components/ErrorBoundary.tsx";
import { App } from "@/components/App";

const ErrorBoundaryError: FC<{ error: unknown }> = ({ error }) => (
  <div>
    <p>An unhandled error occurred:</p>
    <blockquote>
      <code>
        {error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : JSON.stringify(error)}
      </code>
    </blockquote>
  </div>
);

const Inner: FC = () => {
  const debug = useLaunchParams().startParam === "debug";
  /*const manifestUrl = useMemo(() => {
    return new URL("https://telegram-miracle-f1779.web.app/tonconnect-manifest.json", window.location.href).toString();
  }, []);*/
    const manifestUrl = "https://telegram-miracle-f1779.web.app/tonconnect-manifest.json";

  // Enable debug mode to see all the methods sent and events received.
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && debug) {
      import("eruda").then((lib) => lib.default.init());
    }
  }, [debug]);

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}
                          walletsListConfiguration={{
                                  includeWallets: [
                                      {
                                          appName: "tonwallet",
                                          name: "TON Wallet",
                                          imageUrl: "https://wallet.ton.org/assets/ui/qr-logo.png",
                                          aboutUrl: "https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd",
                                          universalLink: "https://wallet.ton.org/ton-connect",
                                          jsBridgeKey: "tonwallet",
                                          bridgeUrl: "https://bridge.tonapi.io/bridge",
                                          platforms: ["chrome", "android"]
                                      },
                          ]}}
                          actionsConfiguration={{
                              twaReturnUrl: 'https://t.me/DoomsDayTyrannybot/start'
                          }}>
      <SDKProvider acceptCustomStyles debug={debug}>
        <App />
      </SDKProvider>
    </TonConnectUIProvider>
  );
};

export const Root: FC = () => (
  <ErrorBoundary fallback={ErrorBoundaryError}>
    <Inner />
  </ErrorBoundary>
);
