"use client";

import { useRef, type ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { makeStore } from "@/store";

export function ReduxProvider({ children }: { children: ReactNode }) {
  const ref = useRef<ReturnType<typeof makeStore>>(null);
  if (!ref.current) {
    ref.current = makeStore();
  }
  return (
    <Provider store={ref.current.store}>
      <PersistGate loading={null} persistor={ref.current.persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
