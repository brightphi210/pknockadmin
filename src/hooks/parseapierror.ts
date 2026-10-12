/**
 * Normalises the many error shapes a backend can return into
 *   - a readable `message`
 *   - `fieldErrors` keyed by field name (for inline form errors)
 *
 * Handles, for example:
 *   { error: true, code: "validationerror", detail: { user: ["This field is required."] } }
 *   { detail: "Not found." }
 *   { email: ["A user with this email already exists."] }
 *   { non_field_errors: ["..."] }
 *   plain strings, network errors, timeouts, 401/403/404/409/429/5xx
 */

export type ParsedApiError = {
    message: string
    fieldErrors: Record<string, string>
    status?: number
    code?: string
}

const toText = (v: unknown): string => {
    if (v == null) return ""
    if (typeof v === "string") return v
    if (Array.isArray(v)) return v.map(toText).filter(Boolean).join(" ")
    if (typeof v === "object") {
        return Object.values(v as Record<string, unknown>).map(toText).filter(Boolean).join(" ")
    }
    return String(v)
}

const prettyField = (key: string) => key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())

const collectFields = (obj: Record<string, unknown>, out: Record<string, string>, prefix = "") => {
    for (const [key, value] of Object.entries(obj)) {
        if (["error", "code", "status", "success"].includes(key) && typeof value !== "object") continue
        const path = prefix ? `${prefix}.${key}` : key
        if (value && typeof value === "object" && !Array.isArray(value)) {
            collectFields(value as Record<string, unknown>, out, path)
        } else {
            const text = toText(value)
            if (text) out[path] = text
        }
    }
}

const statusMessages: Record<number, string> = {
    400: "The request was invalid. Please check your input.",
    401: "Your session has expired. Please sign in again.",
    403: "You don't have permission to do this.",
    404: "The requested resource was not found.",
    409: "This record conflicts with an existing one.",
    413: "The data you sent is too large.",
    422: "Some of the information provided is invalid.",
    429: "Too many requests. Please wait a moment and try again.",
    500: "Something went wrong on our side. Please try again.",
    502: "The server is temporarily unavailable. Please try again.",
    503: "The service is temporarily unavailable. Please try again.",
    504: "The server took too long to respond. Please try again.",
}

export function parseApiError(err: any, fallback = "Something went wrong. Please try again."): ParsedApiError {
    // No response at all: network / timeout / cancelled
    if (err && !err.response) {
        if (err.code === "ECONNABORTED") {
            return { message: "The request timed out. Please try again.", fieldErrors: {}, code: err.code }
        }
        if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
            return {
                message: "Network error. Check your internet connection and try again.",
                fieldErrors: {},
                code: err.code,
            }
        }
        if (err.code === "ERR_CANCELED") {
            return { message: "The request was cancelled.", fieldErrors: {}, code: err.code }
        }
        return { message: err.message || fallback, fieldErrors: {}, code: err.code }
    }

    const status: number | undefined = err?.response?.status
    const data = err?.response?.data ?? err

    // HTML error pages (e.g. proxy / 500 page)
    if (typeof data === "string") {
        const isHtml = /<\s*html|<!doctype/i.test(data)
        return {
            message: isHtml ? statusMessages[status ?? 500] || fallback : data || fallback,
            fieldErrors: {},
            status,
        }
    }

    const fieldErrors: Record<string, string> = {}
    let message = ""
    const code: string | undefined = typeof data?.code === "string" ? data.code : undefined

    const detail = data?.detail
    if (typeof detail === "string") {
        message = detail
    } else if (Array.isArray(detail)) {
        message = toText(detail)
    } else if (detail && typeof detail === "object") {
        // { detail: { user: ["This field is required."] } }
        collectFields(detail, fieldErrors)
    } else if (data && typeof data === "object") {
        // { email: ["..."] } or { non_field_errors: [...] }
        const { message: m, error: e, ...rest } = data as Record<string, unknown>
        if (typeof m === "string") message = m
        else if (typeof e === "string") message = e
        collectFields(rest, fieldErrors)
    }

    const nonField = fieldErrors["non_field_errors"] || fieldErrors["__all__"]
    if (nonField) {
        message = message || nonField
        delete fieldErrors["non_field_errors"]
        delete fieldErrors["__all__"]
    }

    if (!message) {
        const entries = Object.entries(fieldErrors)
        if (entries.length) {
            message = entries.map(([k, v]) => `${prettyField(k.split(".").pop()!)}: ${v}`).join("\n")
        }
    }

    if (!message) message = (status && statusMessages[status]) || fallback

    return { message, fieldErrors, status, code }
}