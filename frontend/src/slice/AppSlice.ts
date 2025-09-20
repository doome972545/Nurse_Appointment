import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialSlice = {
  loading: false,
  reload: false,
};

export const AppSlice = createSlice({
  name: "AppSlice",
  initialState: initialSlice,
  reducers: {
    isLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    isReload: (state, action: PayloadAction<boolean>) => {
      state.reload = action.payload;
    },
  },
});

export const { isLoading, isReload } = AppSlice.actions;
export default AppSlice.reducer;
