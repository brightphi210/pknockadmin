import { useQuery } from "@tanstack/react-query";
import { get_requests } from "../helper/AxioHelper";



// ==================== EVERY HERE IS USERS ===========================

export const useGetTutors = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["tutors"],
        queryFn: async () => {
            const token = (await localStorage.getItem("welearnAdminToken")) || "";
            return get_requests("welearn-admin/tutors/", token);
        },
    });

    return {
        tutors: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};

export const useGetStudents = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["students"],
        queryFn: async () => {
            const token = (await localStorage.getItem("welearnAdminToken")) || "";
            return get_requests("welearn-admin/students/", token);
        },
    });

    return {
        students: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};

export const useGetWithdrawals = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["withdrawals"],
        queryFn: async () => {
            const token = (await localStorage.getItem("welearnAdminToken")) || "";
            return get_requests("welearn-admin/withdrawals/", token);
        },
    });

    return {
        withdrawals: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};


export const useGetBookings = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["bookings"],
        queryFn: async () => {
            const token = (await localStorage.getItem("welearnAdminToken")) || "";
            return get_requests("welearn-admin/bookings/", token);
        },
    });

    return {
        bookings: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};




// ============== GET Single Tutor ===============
export const useGetSingleTutor = (id: string) => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["tutors", id],
        queryFn: async () => {
            const token = (await localStorage.getItem("welearnAdminToken")) || "";
            return get_requests(`tutors/${id}/`, token);
        },
    });

    return {
        tutorData: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};