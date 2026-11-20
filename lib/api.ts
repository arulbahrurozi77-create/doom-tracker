const BASE_URL = "https://doomtracker-backend.vercel.app"

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (response.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  return response
}
