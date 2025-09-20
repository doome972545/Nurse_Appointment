import { AppSlice } from "@/slice/AppSlice";
import { AuthSlice } from "@/slice/AuthSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    app: AppSlice.reducer,
    auth: AuthSlice.reducer,
  },
  devTools: {
    serialize: true,
    actionsDenylist: ["auth/login", "auth/verify"],
    stateSanitizer: (state, _index) => {
      // cast state เป็น any ชั่วคราวเพื่อแก้ type error
      const s = state as any;
      if (s.auth?.user) {
        return {
          ...s,
          auth: {
            ...s.auth,
            user: "***HIDDEN***", // ซ่อนค่า user
          },
        } as typeof state; // cast คืนเป็น original generic type S
      }
      return state;
    },
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
