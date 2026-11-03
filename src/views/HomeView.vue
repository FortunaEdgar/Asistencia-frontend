<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const today = new Date().toLocaleDateString('es-DO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
</script>

<template>
  <section class="card">
    <h1>Hola, {{ auth.user?.name }}</h1>
    <p class="home__date">{{ today }}</p>
    <p>Bienvenido al sistema de gestion de asistencia de empleados.</p>
  </section>
</template>

<style lang="css" scoped>
h1 {
  font-weight: 500;
}
.home__date {
  color: #64748b;
  margin-bottom: 0.75rem;
}
.home__date::first-letter {
  text-transform: uppercase;
}
</style>
