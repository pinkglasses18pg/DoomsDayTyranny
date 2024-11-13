// apps/tma/src/components/App.tsx

import { lazy, FC, Suspense, useMemo } from "react";
import { InitUser } from "./InitUser";
import { LoadIndicator } from "./LoadIndicator";
import { SaveGame } from "./Save";
import "./internationalization";
import { useCloudStorage } from "@tma.js/sdk-react";
import { useRef } from "react";
import { createStore } from "@/store/store";
import { StoreContext, StoreContextType } from "./StoreContext";

const InitMiniApp = lazy(() => import("./InitMiniApp"));

export const App: FC = () => {
  const cloudStorage = useCloudStorage();
  const storeRef = useRef<StoreContextType | null>(null);

  useMemo(() => {
    if (!storeRef.current) {
      storeRef.current = createStore(cloudStorage);
    }
    return storeRef.current;
  }, [cloudStorage]);

  return (
    <StoreContext.Provider value={storeRef.current}>
      <InitUser>
        <SaveGame />
        <Suspense fallback={<LoadIndicator />}>
          <InitMiniApp />
        </Suspense>
      </InitUser>
    </StoreContext.Provider>
  );
};
