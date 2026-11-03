const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export class ApiError extends Error {
  status: number
  fieldErrors: Record<string, string[]>

  constructor(status: number, message: string, fieldErrors: Record<string, string[]> = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      ...options.headers,
    },
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message = data?.message ?? 'Ocurrió un error, intenta de nuevo'
    throw new ApiError(response.status, message, data?.errors ?? {})
  }

  return data as T
}

export function toFormErrors(fieldErrors: Record<string, string[]>): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, messages] of Object.entries(fieldErrors)) {
    const field = key.charAt(0).toLowerCase() + key.slice(1)
    result[field] = messages[0] ?? ''
  }
  return result
}
