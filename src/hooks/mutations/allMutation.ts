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




// ==================== STAFF / PVO ===========================

export type StaffMember = {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  gender?: string
  date_of_birth?: string
  state_of_origin?: string
  nationality?: string
  staff_role?: string
  active?: boolean
  coverage_area?: string
  availability?: boolean
  display_id?: string
  // optional stats if backend returns them
  assigned_count?: number
  completed_count?: number
  pending_count?: number
  last_active?: string
}

export type CreateStaffPayload = {
  user: {
    email: string
    first_name: string
    last_name: string
    phone: string
    password: string
    gender: string
    date_of_birth: string | null
    state_of_origin: string
    nationality: string
    staff_role: string
    active: boolean
    coverage_area: string
  }
  staff_role: string
  active: boolean
}

export type SuspendReactivatePayload = {
  reason: string
}


// Create PVO
export const useCreateStaff = () => {
  return useMutation({
    mutationFn: async (payload: CreateStaffPayload) => {
      const token = (await localStorage.getItem("pknockAdminToken")) || ""
      return post_requests("accounts/staff/", payload, token)
    },
  })
}

// Suspend user
export const useSuspendUser = () => {
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const token = (await localStorage.getItem("pknockAdminToken")) || ""
      return post_requests(`accounts/users/${id}/suspend/`, { reason }, token)
    },
  })
}

// Reactivate user
export const useReactivateUser = () => {
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const token = (await localStorage.getItem("pknockAdminToken")) || ""
      return post_requests(`accounts/users/${id}/reactivate/`, { reason }, token)
    },
  })
}

export const useReplyComplaint = () => {
  return useMutation({
    mutationFn: async ({ id, message }: { id: string; message: string }) => {
      const token = (await localStorage.getItem("pknockAdminToken")) || "";
      return post_requests(`support/complaints/${id}/reply/`, { message }, token);
    },
  });
};


export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const token = (await localStorage.getItem("pknockAdminToken")) || "";
      return post_requests(`notifications/${id}/read/`, {}, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const token = (await localStorage.getItem("pknockAdminToken")) || "";
      return post_requests(`notifications/read-all/`, {}, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};