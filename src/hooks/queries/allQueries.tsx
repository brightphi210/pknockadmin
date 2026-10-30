import { useQuery } from "@tanstack/react-query";
import { get_requests } from "../helper/AxioHelper";
// ==================== ADMIN ANALYTICS ===========================

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


// ==================== EVERY HERE IS USERS ===========================

export const useGetUsers = (page = 1) => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["users", page],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || "";
            return get_requests(`accounts/seekers/?page=${page}`, token);
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
            return get_requests(`accounts/seekers/${id}/`, token);
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



// ============== GET Staff ===============
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


// ============== GET Single Staff ===============
export const useGetSingleStaff = (id: string) => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["staff", id],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || "";
            return get_requests(`accounts/staff/${id}/`, token);
        },
    });

    return {
        staffData: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};

// ============== GET PVO Inspections ===============
export const useGetPvoInspections = (staffId: string, page = 1) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["pvo-inspections", staffId, page],
        enabled: !!staffId,
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || ""
            return get_requests(
                `verification/inspections/?staff_id=${staffId}&page=${page}`,
                token
            )
        },
    })

    return { inspections: data, isLoading, isError, refetch }
}

// ============== GET PVO Overview ===============
export const useGetPvoOverview = (staffId: string) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["pvo-overview", staffId],
        enabled: !!staffId,
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || ""
            return get_requests(`analytics/pvo/overview/?pvo_id=${staffId}`, token)
        },
    })

    return { overview: data, isLoading, isError, refetch }
}


export const useGetInspection = (id?: string) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["inspection", id],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || ""
            return get_requests(`verification/inspections/${id}/`, token)
        },
        enabled: Boolean(id),
    })

    return { inspection: data, isLoading, isError, refetch }
}

// ==================== PROPERTIES ===========================

export const useGetProperties = (page = 1) => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["properties", page],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || "";
            return get_requests(`properties/properties/?page=${page}`, token);
        },
    });

    return {
        properties: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};

export type PropertyRecord = {
    id?: string;
    owner_profile?: string | { id?: string; first_name?: string; last_name?: string; email?: string };
    owner_profile_id?: string;
    assigned_pvo?: string | { id?: string; first_name?: string; last_name?: string };
    assigned_pvo_id?: string;
    title?: string;
    description?: string;
    price?: string | number;
    listing_type?: string;
    property_type?: string;
    status?: string;
    occupancy_status?: string;
    state?: string;
    city?: string;
    lga?: string;
    neighbourhood?: string;
    street_address?: string;
    bedrooms?: number;
    bathrooms?: number;
    published_at?: string;
    created_at?: string;
    updated_at?: string;
    owner_name?: string;
    tenant_name?: string;
    pvo_name?: string;
    // …other fields from your schema as needed
};


export const useGetInspections = (page = 1) => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["inspections", page],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || "";
            return get_requests(`verification/inspections/?page=${page}`, token);
        },
    });

    return {
        inspections: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};


export const useGetComplaints = (page = 1) => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["complaints", page],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || "";
            return get_requests(`complaints/complaints/?page=${page}`, token);
        },
    });
    return {
        complaints: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};


export const useGetNotifications = (page = 1) => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["notifications", page],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || "";
            return get_requests(`notifications/?page=${page}`, token);
        },
    });

    return {
        notifications: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};


export const useUnreadNotificationCount = () => {
    const { data } = useQuery({
        queryKey: ["notifications", 1],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || "";
            return get_requests(`notifications/?page=1`, token);
        },
        enabled: Boolean(localStorage.getItem("pknockAdminToken")),
        refetchInterval: 60_000,
    });

    const payload = (data as any)?.data ?? data;
    const results: { read_at?: string | null }[] = Array.isArray(payload?.results)
        ? payload.results
        : Array.isArray(payload)
            ? payload
            : [];

    const unreadCount = results.filter((n) => !n.read_at).length;
    const hasMore =
        Boolean(payload?.next) && results.length > 0 && unreadCount === results.length;

    return { unreadCount, hasMore };
};


export const useGetProperty = (id?: string) => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["property", id],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || "";
            return get_requests(`properties/properties/${id}/`, token);
        },
        enabled: Boolean(id),
    });

    return {
        property: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};


export const useGetSessions = (page = 1, pageSize = 10) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["sessions", page, pageSize],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || ""
            return get_requests(`accounts/sessions/?page=${page}&page_size=${pageSize}`, token)
        },
    })

    return { sessions: data, isLoading, isError, refetch }
}

// ============== GET Notification Preferences ===============
export const useGetNotificationPrefs = () => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["notification-prefs"],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || ""
            return get_requests("notifications/preferences/", token)
        },
    })

    return { prefs: data, isLoading, isError, refetch }
}

export const useGetPlatformSettings = () => {
    const query = useQuery({
        queryKey: ["platform-settings"],
        queryFn: async () => {
            const token = (await localStorage.getItem("pknockAdminToken")) || ""
            return get_requests("payments/settings/", token)
        },
    })

    return {
        settings: query.data?.data ?? query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    }
}


