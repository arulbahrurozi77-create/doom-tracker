const BASE_URL = "https://doomtracker-backend.vercel.app"

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
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

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.clear()
      window.location.href = "/login"
    }
    throw new Error("Unauthorized")
  }

  return response
}
