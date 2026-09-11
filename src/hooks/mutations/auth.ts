import { useMutation } from "@tanstack/react-query";
import { post_requests } from "../helper/AxioHelper";

export const useLogin = () => {
  const loginMutation = useMutation({
    mutationFn: (data: any) => post_requests("welearn-admin/login/", data),
  });

  return loginMutation;
};