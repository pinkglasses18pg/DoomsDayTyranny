// apps/tma/src/store/useHttpsCallable.ts

import {
  Functions,
  httpsCallable,
  HttpsCallableResult,
} from "firebase/functions";
import { useCallback, useState } from "react";
import { retrieveLaunchParams } from "@tma.js/sdk";

export type HttpsCallableHook<
  RequestData = unknown,
  ResponseData = unknown,
> = Readonly<
  [
    (
      data?: RequestData,
    ) => Promise<HttpsCallableResult<ResponseData> | undefined>,
    boolean,
    Error | undefined,
  ]
>;

export default <RequestData = unknown, ResponseData = unknown>(
  functions: Functions,
  name: string,
): HttpsCallableHook<RequestData, ResponseData> => {
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<boolean>(false);

  const callCallable = useCallback(
    async (
      data?: RequestData,
    ): Promise<HttpsCallableResult<ResponseData> | undefined> => {
      const { initDataRaw } = retrieveLaunchParams();
      const callable = httpsCallable<RequestData, ResponseData>(
        functions,
        name,
      );
      setLoading(true);
      setError(undefined);
      try {
        return await callable({
          ...data,
          auth: `tma ${initDataRaw}`,
        } as RequestData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [functions, name],
  );

  return [callCallable, loading, error] as const;
};
