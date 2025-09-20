import { apiClient } from "@/config/api-client";
import { ALL_NURSE, LOGIN } from "@/config/constants";

export async function loginUser(email: string, password: string) {
  try {
    const res = await apiClient.post(LOGIN, { email, password });

    if (res.status !== 200) {
      throw res.data;
    }

    const data = res.data;
    const token = res.headers["authorization"]; // ✅ ใช้ lowercase
    return { ...data, token };
  } catch (error: any) {
    console.error("Login error:", error);

    // ✅ ส่ง response ทั้งก้อนกลับไป
    throw error.response?.data || { message: "Login failed" };
  }
}

export async function getAllNurse() {
  try {
    const res = await apiClient.get(ALL_NURSE);
    if (res.status !== 200) {
      throw res.data;
    }
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "fecth failed" };
  }
}
