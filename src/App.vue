<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();

async function onLogout() {
  await auth.logout();
  router.push({ name: "login" });
}
</script>

<template>
  <header v-if="auth.isAuthenticated" class="header">
    <span class="header__brand">Asistencia</span>
    <nav class="header__nav">
      <RouterLink to="/">Inicio</RouterLink>
    </nav>
    <div class="header__user">
      <span>{{ auth.user?.name }}</span>
      <button class="btn btn--secondary" type="button" @click="onLogout">
        Cerrar sesión
      </button>
    </div>
  </header>

  <main class="main">
    <RouterView />
  </main>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: #1e293b;
  color: #fff;
}
.header__brand {
  font-weight: 700;
  font-size: 1.1rem;
}
.header__nav {
  display: flex;
  gap: 1rem;
  flex: 1;
}
.header__nav a {
  color: #cbd5e1;
  text-decoration: none;
}
.header__nav a.router-link-exact-active {
  color: #fff;
  font-weight: 600;
}
.header__user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
</style>
