import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patch_requests, post_requests } from "../helper/AxioHelper";


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


export const useApproveListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const token = (await localStorage.getItem("pknockAdminToken")) || "";
      return post_requests(`properties/properties/${id}/approve_listing/`, {}, token);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["property", id] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};

export const useUpdateNotificationPrefs = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: {
      email_enabled: boolean
      push_enabled: boolean
      activities: string
    }) => {
      const token = (await localStorage.getItem("pknockAdminToken")) || ""
      return patch_requests("notifications/preferences/", body, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-prefs"] })
    },
  })
}


export const useUpdatePlatformSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: any) => {
      const token = (await localStorage.getItem("pknockAdminToken")) || ""
      return patch_requests("payments/settings/", body, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] })
    },
  })
}



export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async (body: any) => {
      const token = (await localStorage.getItem("pknockOwnerToken")) || "";
      return post_requests("accounts/otp/verify/", body, token);
    },
  });
};

// POST accounts/otp/request/   body: { channel: "phone" | "email", phone?: string }
// !! ASSUMED endpoint: the spec only lists otp/verify/. Change the path to your real "send OTP" route.
export const useRequestOtp = () => {
  return useMutation({
    mutationFn: async (body: any) => {
      const token = (await localStorage.getItem("pknockOwnerToken")) || "";
      return post_requests("accounts/otp/request/", body, token);
    },
  });
};

// ============== Password ===============
// POST accounts/password/change/   body: { current_password, new_password }
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (body: any) => {
      const token = (await localStorage.getItem("pknockOwnerToken")) || "";
      return post_requests("accounts/password/change/", body, token);
    },
  });
};

// ============== KYC ===============
// POST accounts/kyc/submit/   multipart: id_document_type, id_document_file (owners/staff) | facial_image (seekers)
export const useSubmitKyc = () => {
  return useMutation({
    mutationFn: async (body: any) => {
      const token = (await localStorage.getItem("pknockOwnerToken")) || "";
      return post_requests("accounts/kyc/submit/", body, token);
    },
  });
};

// ============== Bank accounts ===============
// POST accounts/bank-accounts/   body: { bank_name, bank_code, account_number }
export const useCreateBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => {
      const token = (await localStorage.getItem("pknockOwnerToken")) || "";
      return post_requests("accounts/bank-accounts/", body, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
    },
  });
};

// ============== Two-factor (TOTP) ===============
// POST accounts/totp/enroll/  -> { provisioning_uri, qr_svg, backup_codes[10] }  (400 if already active)
export const useEnrollTotp = () => {
  return useMutation({
    mutationFn: async () => {
      const token = (await localStorage.getItem("pknockOwnerToken")) || "";
      return post_requests("accounts/totp/enroll/", {}, token);
    },
  });
};

// POST accounts/totp/confirm/   body: { code }
export const useConfirmTotp = () => {
  return useMutation({
    mutationFn: async (body: any) => {
      const token = (await localStorage.getItem("pknockOwnerToken")) || "";
      return post_requests("accounts/totp/confirm/", body, token);
    },
  });
};

// POST accounts/totp/verify/   body: { challenge_token, code }   (login-time 2FA step)
export const useVerifyTotp = () => {
  return useMutation({
    mutationFn: async (body: any) => {
      const token = (await localStorage.getItem("pknockOwnerToken")) || "";
      return post_requests("accounts/totp/verify/", body, token);
    },
  });
};

// accounts/totp/   body: { active, password?, code }
//   disable: { active: false, password, code }   enable again: { active: true, code }
// !! HTTP method ASSUMED to be PATCH (the spec doesn't say). Switch to post_requests if the API expects POST.
export const useToggleTotp = () => {
  return useMutation({
    mutationFn: async (body: any) => {
      const token = (await localStorage.getItem("pknockOwnerToken")) || "";
      return patch_requests("accounts/totp/", body, token);
    },
  });
};
