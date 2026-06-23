import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import cart from "./slices/cartSlice";
import wishlist from "./slices/wishlistSlice";
import auth from "./slices/authSlice";
import ui from "./slices/uiSlice";
import filters from "./slices/filtersSlice";

const rootReducer = combineReducers({ cart, wishlist, auth, ui, filters });

const persistConfig = {
  key: "cs-collections",
  version: 1,
  storage,
  whitelist: ["cart", "wishlist", "auth"], // ui & filters are session-only
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefault) =>
      getDefault({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
  const persistor = persistStore(store);
  return { store, persistor };
};

export type AppStore = ReturnType<typeof makeStore>["store"];
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];
