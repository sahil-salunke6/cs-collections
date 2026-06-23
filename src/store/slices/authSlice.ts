import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";
import { mockUser } from "@/data/account";

interface AuthState {
  user: User | null;
  status: "idle" | "authenticated";
}

const initialState: AuthState = { user: null, status: "idle" };

/* Demo admin: sign in with this email (any password) to access /admin. */
export const ADMIN_EMAIL = "admin@cscollections.com";

/* Mock auth — accepts any credentials and returns the demo user.
   Replace `login` payload handling with a real API call later. */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string } | undefined>) => {
      const email = action.payload?.email || mockUser.email;
      const isAdmin = email.toLowerCase() === ADMIN_EMAIL;
      state.user = {
        ...mockUser,
        email,
        role: isAdmin ? "admin" : "customer",
        firstName: isAdmin ? "Store" : mockUser.firstName,
        lastName: isAdmin ? "Admin" : mockUser.lastName,
      };
      state.status = "authenticated";
    },
    register: (
      state,
      action: PayloadAction<{ firstName: string; lastName: string; email: string }>,
    ) => {
      state.user = {
        ...mockUser,
        role: "customer",
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
      };
      state.status = "authenticated";
    },
    logout: (state) => {
      state.user = null;
      state.status = "idle";
    },
  },
});

export const { login, register, logout } = authSlice.actions;
export default authSlice.reducer;
