import { apiClient } from "@/config/api-client";
import { GET_ALL_LEAVE_REQUEST, LEAVE_REQUEST } from "@/config/constants";
import { isReload } from "@/slice/AppSlice";
import { store } from "@/store";

export async function leaveRequest(reason: string, shiftAssignment_id: number) {
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
    return data;
  } catch (error: any) {
    // ✅ ส่ง response ทั้งก้อนกลับไป
    throw error.response?.data || { message: "Leave Requst failed" };
  }
}

export async function getAllLeaveRequest() {
  try {
    const res = await apiClient.get(GET_ALL_LEAVE_REQUEST);

    if (res.status !== 200) {
      throw res.data;
    }

    const data = res.data;
    return data;
  } catch (error: any) {
    throw error.response?.data || { message: "Leave Requst failed" };
  }
}
