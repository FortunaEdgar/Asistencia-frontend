import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { http } from '@/services/http'
import type { LoginPayload, LoginResponse, RegisterPayload, User } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const checked = ref(false)
  const isAuthenticated = computed(() => user.value !== null)

  async function fetchMe() {
    try {
      user.value = await http<User>('/v1/auth/me')
    } catch {
      user.value = null
    } finally {
      checked.value = true
    }
  }

  async function login(payload: LoginPayload) {
    const response = await http<LoginResponse>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    user.value = response.user
    checked.value = true
  }

  async function register(payload: RegisterPayload) {
    await http<User>('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async function logout() {
    try {
      await http('/v1/auth/logout', { method: 'POST' })
    } finally {
      user.value = null
    }
  }

  return { user, checked, isAuthenticated, fetchMe, login, register, logout }
})
