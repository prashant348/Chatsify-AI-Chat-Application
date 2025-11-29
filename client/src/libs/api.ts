const BASE = import.meta.env.VITE_API_URL // node server api url
const DEFAULT_TIMEOUT = 20000; // 20s

export type ApiError = {
    status: number,
    message: string
}

async function api<T>(
    path: string,
    opts: RequestInit & { token?: string; timeoutMs?: number } = {}
): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? DEFAULT_TIMEOUT);

    const res = await fetch(`${BASE}${path}`, {
        ...opts,
        headers: {
            "Content-Type": "application/json",
            ...(opts.token? { "Authorization": `Bearer ${opts.token}` }: {}),
            ...(opts.headers || {} ),
        },
        signal: controller.signal,
        credentials: "include",
    }).catch((err) => {
        clearTimeout(timeout);
        throw { status: 0, message: err?.name === "AbortError" ? "Request timeout": "Network Error" }
    });

    clearTimeout(timeout)

    if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw { status: res.status, message: txt || res.statusText } as ApiError;
    }

    if (res.status === 204) return undefined as unknown as T;
    return (await res.json()) as T;
}

export const apiGet = <T>(p: string, token?: string) => api<T>(p, { method: "GET", token });
export const apiPost = <T>(p: string, body?: any, token?: string) => 
    api<T>(p, { method: "POST", body: JSON.stringify(body ?? {}), token })
export const apiDel = <T>(p: string, body?: any, token?: string) => 
    api<T>(p, { method: "DELETE", body: body ? JSON.stringify(body) : undefined , token });
