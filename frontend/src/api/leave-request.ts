import { apiClient } from "@/config/api-client";
import {
  APPROVE_REQUEST_LEAVE,
  GET_ALL_LEAVE_REQUEST,
  LEAVE_REQUEST,
} from "@/config/constants";
import { isLoading, isReload } from "@/slice/AppSlice";
import { store } from "@/store";

export async function leaveRequest(reason: string, shiftAssignment_id: number) {
  store.dispatch(isLoading(true));
  try {
    const res = await apiClient.post(LEAVE_REQUEST, {
      reason,
      shiftAssignment_id,
    });

    if (res.status !== 200) {
      throw res.data;
    }

    const data = res.data;
    store.dispatch(isReload(true));
    store.dispatch(isLoading(false));
    return data;
  } catch (error: any) {
    // ✅ ส่ง response ทั้งก้อนกลับไป
    store.dispatch(isLoading(false));
    throw error.response?.data || { message: "Leave Requst failed" };
  }
}

export async function getAllLeaveRequest() {
  store.dispatch(isLoading(true));
  try {
    const res = await apiClient.get(GET_ALL_LEAVE_REQUEST);

    if (res.status !== 200) {
      throw res.data;
    }

    const data = res.data;
    store.dispatch(isLoading(false));
    return data;
  } catch (error: any) {
    store.dispatch(isLoading(false));
    throw error.response?.data || { message: "Leave Requst failed" };
  }
}

export async function approveRequestLeave(id: number, type: string) {
  store.dispatch(isLoading(true));
  try {
    const res = await apiClient.patch(`${APPROVE_REQUEST_LEAVE}/${id}/${type}`);
    if (res.status !== 200) {
      throw res.data;
    }
    const data = res.data;
    store.dispatch(isReload(true));
    store.dispatch(isLoading(false));
    return data;
  } catch (error: any) {
    store.dispatch(isLoading(false));
    throw error.response?.data || { message: "Leave Requst failed" };
  }
}
