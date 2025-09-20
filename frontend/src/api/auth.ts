import { apiClient } from "@/config/api-client";
import { ALL_NURSE, LOGIN, REGISTER } from "@/config/constants";
import { isLoading } from "@/slice/AppSlice";
import { store } from "@/store";

export async function loginUser(email: string, password: string) {
  store.dispatch(isLoading(true));
  try {
    const res = await apiClient.post(LOGIN, { email, password });

    if (res.status !== 200) {
      throw res.data;
    }

    const data = res.data;
    const token = res.headers["authorization"]; // ✅ ใช้ lowercase
    store.dispatch(isLoading(false));
    return { ...data, token };
  } catch (error: any) {
    console.error("Login error:", error);
    store.dispatch(isLoading(false));
    // ✅ ส่ง response ทั้งก้อนกลับไป
    throw error.response?.data || { message: "Login failed" };
  }
}

export async function getAllNurse() {
  store.dispatch(isLoading(true));
  try {
    const res = await apiClient.get(ALL_NURSE);
    if (res.status !== 200) {
      throw res.data;
    }
    store.dispatch(isLoading(false));
    return res.data;
  } catch (error: any) {
    store.dispatch(isLoading(false));
    throw error.response?.data || { message: "fecth failed" };
  }
}

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  store.dispatch(isLoading(true));
  try {
    const res = await apiClient.post(REGISTER, { name, email, password });

    if (res.status !== 201) {
      throw res.data;
    }

    const data = res.data;
    store.dispatch(isLoading(false));
    return data;
  } catch (error: any) {
    console.error("Login error:", error);
    store.dispatch(isLoading(false));
    // ✅ ส่ง response ทั้งก้อนกลับไป
    throw error.response?.data || { message: "Login failed" };
  }
}
