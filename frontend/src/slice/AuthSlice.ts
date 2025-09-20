import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AES, enc } from "crypto-ts";
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

type User = {
  email: string;
  name: string;
  role: "HEAD_NURSE" | "NURSE" | "ADMIN" | "CASHIER";
  token: string;
};

const encryptData = (data: User): string => {
  return AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (ciphertext: string): User | null => {
  try {
    const bytes = AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(enc.Utf8);
    return JSON.parse(decrypted) as User;
  } catch (e) {
    return null;
  }
};

// ฟังก์ชันตรวจสอบว่า user ล็อกอินอยู่หรือไม่
export const isUserAuthenticated = (encryptedUser: string | null): boolean => {
  if (!encryptedUser) return false;
  const user = decryptData(encryptedUser);
  return user !== null && !!user.token;
};

const storedUser = localStorage.getItem("user");

interface AuthState {
  user: string | null;
}

const initialSlice: AuthState = {
  user: storedUser || null,
};

export const AuthSlice = createSlice({
  name: "AuthSlice",
  initialState: initialSlice,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      const encrypted = encryptData(action.payload);
      localStorage.setItem("user", encrypted);
      state.user = encrypted;
      window.location.reload(); // ใช้ window.location.reload() แทน location.reload()
    },
    logout: (state) => {
      localStorage.removeItem("user");
      state.user = null;
      //   window.location.href = "/login"; // redirect ไป login หลัง logout
      window.location.reload();
    },
  },
});

export const { login, logout } = AuthSlice.actions;
export default AuthSlice.reducer;
