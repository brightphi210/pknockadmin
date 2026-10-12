import { useQuery } from "@tanstack/react-query";
import { get_requests } from "../helper/AxioHelper";



// ==================== EVERY HERE IS USERS ===========================

export const useGetUsers = (page = 1) => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["users", page],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || "";
            return get_requests(`accounts/users/?page=${page}`, token);
        },
    });

    return {
        users: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};

export const useGetOwners = (page = 1) => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["owners", page],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || "";
            return get_requests(`accounts/owners/?page=${page}`, token);
        },
    });

    return {
        owners: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};

export type AdminOverviewResponse = {
    total_properties?: { value?: number; delta_pct?: number };
    verified_properties?: { value?: number; delta_pct?: number };
    pending_approval?: { value?: number; delta_pct?: number };
    inspections_completed?: { value?: number; delta_pct?: number };
    total_revenue?: { value?: number | string; delta_pct?: number };
    total_users?: { value?: number; delta_pct?: number; new_this_week?: number };
    active_pvos?: { value?: number; delta_pct?: number };
    open_complaints?: { value?: number; delta_pct?: number };
};

export const useGetAdminOverview = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["admin-overview"],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || "";
            return get_requests("analytics/admin/overview/", token);
        },
    });

    return {
        overview: data?.data ?? data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};

// ============== GET Single User ===============
export const useGetSingleUser = (id: string) => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["users", id],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || "";
            return get_requests(`accounts/users/${id}/`, token);
        },
    });

    return {
        userData: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};


// ============== GET Single Owner ===============
export const useGetSingleOwner = (id: string) => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["owners", id],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || "";
            return get_requests(`accounts/owners/${id}/`, token);
        },
    });

    return {
        ownerData: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};


// ==================== ADMIN ANALYTICS ===========================

export type RevenueSeriesResponse = {
    series: Array<{
        month: string
        value: number | string
    }>
}

export type PropertyMixResponse = {
    published: number
    pending_verification: number
    pending_pvo_visit: number
    rejected: number
    suspended: number
    archived: number
}

export type VerificationFunnelResponse = {
    stages: Record<string, number>
    activity: Array<{
        month: string
        approved: number
        submitted: number
    }>
}

export type UserGrowthResponse = {
    series: Array<{
        month: string
        seekers: number
        owners: number
        pvos: number
    }>
}

export type TopPvoItem = {
    user_id: string
    name: string
    completed_count: number
    rating_avg: number
}

export type RecentActivityItem = {
    id: string
    actor_id: string
    verb: string
    target_type: string
    target_id: string
    created_at: string
}

export const useGetAdminRevenueSeries = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["admin-revenue-series"],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || ""
            return get_requests("analytics/admin/revenue-series/", token)
        },
    })

    return {
        revenueSeries: (data?.data ?? data) as RevenueSeriesResponse | undefined,
        isLoading,
        isError,
        isFetched,
        refetch,
    }
}

export const useGetAdminPropertyMix = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["admin-property-mix"],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || ""
            return get_requests("analytics/admin/property-mix/", token)
        },
    })

    return {
        propertyMix: (data?.data ?? data) as PropertyMixResponse | undefined,
        isLoading,
        isError,
        isFetched,
        refetch,
    }
}

export const useGetAdminVerificationFunnel = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["admin-verification-funnel"],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || ""
            return get_requests("analytics/admin/verification-funnel/", token)
        },
    })

    return {
        verificationFunnel: (data?.data ?? data) as VerificationFunnelResponse | undefined,
        isLoading,
        isError,
        isFetched,
        refetch,
    }
}

export const useGetAdminUserGrowth = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["admin-user-growth"],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || ""
            return get_requests("analytics/admin/user-growth/", token)
        },
    })

    return {
        userGrowth: (data?.data ?? data) as UserGrowthResponse | undefined,
        isLoading,
        isError,
        isFetched,
        refetch,
    }
}

export const useGetAdminTopPvos = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["admin-top-pvos"],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || ""
            return get_requests("analytics/admin/top-pvos/", token)
        },
    })

    return {
        topPvos: (data?.data ?? data) as TopPvoItem[] | undefined,
        isLoading,
        isError,
        isFetched,
        refetch,
    }
}


export const useGetStaff = (page = 1) => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["staff", page],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || ""
            return get_requests(`accounts/staff/?page=${page}`, token)
        },
    })

    return {
        staff: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    }
}