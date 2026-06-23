import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  cartDrawerOpen: boolean;
  mobileNavOpen: boolean;
  searchOpen: boolean;
}

const initialState: UiState = {
  cartDrawerOpen: false,
  mobileNavOpen: false,
  searchOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCartDrawer: (state, action: PayloadAction<boolean>) => {
      state.cartDrawerOpen = action.payload;
    },
    setMobileNav: (state, action: PayloadAction<boolean>) => {
      state.mobileNavOpen = action.payload;
    },
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.searchOpen = action.payload;
    },
  },
});

export const { setCartDrawer, setMobileNav, setSearchOpen } = uiSlice.actions;
export default uiSlice.reducer;
