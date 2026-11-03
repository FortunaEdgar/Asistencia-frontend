<script lang="ts" setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { useAuthStore } from '@/stores/auth'
import { ApiError } from '@/services/http'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const serverError = ref('')

const schema = toTypedSchema(
  z.object({
    email: z
      .string({ message: 'El correo es obligatorio' })
      .email({ message: 'El correo es invalido.' }),
    password: z
      .string({ message: 'La contraseña es obligatoria' })
      .min(8, { message: 'La contraseña debe tener minimo 8 caracteres' }),
  }),
)

const { errors, handleSubmit, defineField, isSubmitting } = useForm({
  validationSchema: schema,
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  try {
    await auth.login(values)
    // Si venia de una ruta protegida, vuelve a ella; si no, al inicio
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    router.push(redirect)
  } catch (error) {
    serverError.value =
      error instanceof ApiError ? error.message : 'No se pudo conectar con el servidor'
  }
})
</script>

<template>
  <section class="auth card">
    <h1 class="auth__title">Iniciar sesion</h1>

    <p v-if="route.query.registered" class="alert alert--success">
      Cuenta creada. Ya puedes iniciar sesion.
    </p>
    <p v-if="serverError" class="alert alert--error">{{ serverError }}</p>

    <form class="form" @submit.prevent="onSubmit">
      <fieldset class="form__fieldset">
        <label class="form__label" for="email">Correo</label>
        <input
          id="email"
          class="form__input"
          type="email"
          placeholder="correo@empresa.com"
          v-model="email"
          v-bind="emailAttrs"
          :class="{ 'form__input--error': errors.email }"
        />
        <span class="form__error">{{ errors.email }}</span>
      </fieldset>

      <fieldset class="form__fieldset">
        <label class="form__label" for="password">Contraseña</label>
        <input
          id="password"
          class="form__input"
          type="password"
          placeholder="Contraseña"
          v-model="password"
          v-bind="passwordAttrs"
          :class="{ 'form__input--error': errors.password }"
        />
        <span class="form__error">{{ errors.password }}</span>
      </fieldset>

      <button class="btn" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Ingresando...' : 'Ingresar' }}
      </button>
    </form>

    <p class="auth__footer">
      ¿No tienes cuenta? <RouterLink to="/register">Registrate</RouterLink>
    </p>
  </section>
</template>
