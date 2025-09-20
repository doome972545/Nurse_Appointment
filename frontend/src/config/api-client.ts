import axios from "axios";

// import { decodeUser } from "@/slice/AuthSlice";
import { HOST_BASE } from "./constants";
import { store } from "@/store";
import { decryptData } from "@/slice/AuthSlice";

export const apiClient = axios.create({
  baseURL: HOST_BASE,
});
// ดัก request ทุกครั้งแล้ว inject token
apiClient.interceptors.request.use((config) => {
  const encryptedUser = store.getState().auth.user;
  if (encryptedUser) {
    const user = decryptData(encryptedUser);
    if (user?.token) {
      config.headers.Authorization = user.token;
    }
  }
  return config;
});
