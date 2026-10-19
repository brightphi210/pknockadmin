import { useMutation } from "@tanstack/react-query";
import { post_requests } from "../helper/AxioHelper";

export const useLogin = () => {
  const loginMutation = useMutation({
    mutationFn: (data: any) => post_requests("accounts/login/", data),
  });

  return loginMutation;
};


export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      const token = (await localStorage.getItem("pknockAdminToken")) || "";
      const refresh = (await localStorage.getItem("pknockAdminRefreshToken")) || "";
      return post_requests(`accounts/logout/`, { refresh }, token);
    },
  });
};