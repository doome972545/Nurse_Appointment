import { apiClient } from "@/config/api-client";
import {
  ADD_SHIFT,
  GET_ALL_SHIFT,
  GET_NURSE_SHIFT,
  GET_SHIFT_NURSE,
  SHIFT_ASSIGNMENT,
} from "@/config/constants";
import { isReload } from "@/slice/AppSlice";
import { store } from "@/store";

export async function getAllShift() {
  try {
    const res = await apiClient.get(GET_ALL_SHIFT);

    if (res.status !== 200) {
      throw res.data;
    }

    const data = res.data;
    return { data };
  } catch (error: any) {
    console.error("Login error:", error);
    throw error.response?.data || { message: "Login failed" };
  }
}

export async function addShift(
  date: string,
  start_time: string,
  end_time: string
) {
  try {
    const res = await apiClient.post(ADD_SHIFT, { date, start_time, end_time });
    if (res.status !== 200) {
      throw res.data;
    }
    store.dispatch(isReload(true));
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "add shift error" };
  }
}

export async function addNurseToShift(shift_id: number, user_id: string[]) {
  try {
    const res = await apiClient.post(SHIFT_ASSIGNMENT, { shift_id, user_id });
    console.log(res.data);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "add nurse error" };
  }
}

export async function getNurseInShift(shift_id: number) {
  try {
    const res = await apiClient.get(`${GET_NURSE_SHIFT}${shift_id}/nurse`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "add nurse error" };
  }
}

export async function getShiftNurse() {
  try {
    const res = await apiClient.get(`${GET_SHIFT_NURSE}`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "add nurse error" };
  }
}
