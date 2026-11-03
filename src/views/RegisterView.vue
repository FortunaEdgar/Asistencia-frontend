<script lang="ts" setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { useAuthStore } from '@/stores/auth'
import { ApiError, toFormErrors } from '@/services/http'

const auth = useAuthStore()
const router = useRouter()

const serverError = ref('')

const schema = toTypedSchema(
  z
    .object({
      name: z
        .string({ message: 'El nombre es obligatorio' })
        .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
        .max(100, { message: 'El nombre no debe superar los 100 caracteres' }),
      email: z
        .string({ message: 'El correo es obligatorio' })
        .email({ message: 'El correo es invalido.' }),
      password: z
        .string({ message: 'La contraseña es obligatoria' })
        .min(8, { message: 'La contraseña debe tener minimo 8 caracteres' }),
      confirmPassword: z.string({ message: 'Debes confirmar la contraseña' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword'],
    }),
)

const { errors, handleSubmit, defineField, isSubmitting, setErrors } = useForm({
  validationSchema: schema,
})

const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword')

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  try {
    await auth.register(values)
    router.push({ name: 'login', query: { registered: '1' } })
  } catch (error) {
    if (error instanceof ApiError) {
      setErrors(toFormErrors(error.fieldErrors)) // errores 400 por campo
      serverError.value = error.message
    } else {
      serverError.value = 'No se pudo conectar con el servidor'
    }
  }
})
</script>

<template>
  <section class="auth card">
    <h1 class="auth__title">Crear cuenta</h1>

    <p v-if="serverError" class="alert alert--error">{{ serverError }}</p>

    <form class="form" @submit.prevent="onSubmit">
      <fieldset class="form__fieldset">
        <label class="form__label" for="name">Nombre</label>
        <input
          id="name"
          class="form__input"
          type="text"
          placeholder="Tu nombre"
          v-model="name"
          v-bind="nameAttrs"
          :class="{ 'form__input--error': errors.name }"
        />
        <span class="form__error">{{ errors.name }}</span>
      </fieldset>

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
          placeholder="Minimo 8 caracteres"
          v-model="password"
          v-bind="passwordAttrs"
          :class="{ 'form__input--error': errors.password }"
        />
        <span class="form__error">{{ errors.password }}</span>
      </fieldset>

      <fieldset class="form__fieldset">
        <label class="form__label" for="confirmPassword">Confirmar contraseña</label>
        <input
          id="confirmPassword"
          class="form__input"
          type="password"
          placeholder="Repite la contraseña"
          v-model="confirmPassword"
          v-bind="confirmPasswordAttrs"
          :class="{ 'form__input--error': errors.confirmPassword }"
        />
        <span class="form__error">{{ errors.confirmPassword }}</span>
      </fieldset>

      <button class="btn" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Creando cuenta...' : 'Registrarme' }}
      </button>
    </form>

    <p class="auth__footer">
      ¿Ya tienes cuenta? <RouterLink to="/login">Inicia sesion</RouterLink>
    </p>
  </section>
</template>
