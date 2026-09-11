import { useMutation, useQueryClient } from "@tanstack/react-query";
import { post_requests } from "../helper/AxioHelper";


// ==================== USERS HOOK ====================

export const useMakeBookings = () => {
  const queryClient = useQueryClient()

  const makeBookings = useMutation({
    mutationFn: async (data: any) => {
      const token = (await localStorage.getItem("welearnToken")) || ""
      return post_requests(`bookings/`, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
    },
  })

  return makeBookings
}


export const useApproveTutor = (id: string) => {
  const queryClient = useQueryClient()
  const approveTutor = useMutation({
    mutationFn: async (data: any = {}) => {
      const token = (await localStorage.getItem("welearnAdminToken")) || ""
      return post_requests(`welearn-admin/tutors/${id}/approve/`, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutors"] })
    },
  })

  return approveTutor
}

export const useRejectTutor = (id: string) => {
  const queryClient = useQueryClient()

  const rejectTutor = useMutation({
    mutationFn: async (data: any = {}) => {
      const token = (await localStorage.getItem("welearnAdminToken")) || ""
      return post_requests(`welearn-admin/tutors/${id}/reject/`, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutors"] })
    },
  })

  return rejectTutor
}


export const useGenerateReceipt = (id: string) => {
  const queryClient = useQueryClient()

  const generateReceipt = useMutation({
    mutationFn: async (data: any = {}) => {
      const token = (await localStorage.getItem("welearnAdminToken")) || ""
      return post_requests(`welearn-admin/withdrawals/${id}/receipt/`, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] })
    },
  })

  return generateReceipt
}


export const useApproveWithdrawals = (id: string | number) => {
  const queryClient = useQueryClient();

  const approveWithdrawal = useMutation({
    mutationFn: async (data: any = {}) => {
      const token = localStorage.getItem("welearnAdminToken") || "";
      return post_requests(
        `welearn-admin/withdrawals/${id}/approve/`,
        data,
        token
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["tutors"] });
    },
  });

  return approveWithdrawal;
};

export const useRejectWithdrawals = (id: string | number) => {
  const queryClient = useQueryClient();

  const rejectWithdrawal = useMutation({
    mutationFn: async (data: any = {}) => {
      const token = localStorage.getItem("welearnAdminToken") || "";
      return post_requests(
        `welearn-admin/withdrawals/${id}/reject/`,
        data,
        token
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["tutors"] });
    },
  });

  return rejectWithdrawal;
};

