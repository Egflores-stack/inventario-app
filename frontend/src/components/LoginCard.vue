<template>
  <div class="bg-white shadow-lg rounded-2xl border border-gray-200 p-8 w-full max-w-md mx-auto">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
        🔐
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Iniciar sesión</h2>
        <p class="text-sm text-gray-500">Accede con tu usuario y rol asignado.</p>
      </div>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-5">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Usuario</label>
        <input
          v-model="username"
          type="text"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          autocomplete="username"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
        <input
          v-model="password"
          type="password"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          autocomplete="current-password"
        />
      </div>

      <p v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{{ error }}</p>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
        :disabled="loading"
      >
        <span v-if="loading" class="animate-spin">⏳</span>
        <span>{{ loading ? 'Validando...' : 'Entrar' }}</span>
      </button>

      <div class="text-xs text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-lg p-3">
        Usuarios demo: <strong>admin / admin123</strong> (administrador) o <strong>usuario / usuario123</strong>
        (solo lectura)
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const username = ref('')
const password = ref('')

const { login, error, loading } = useAuth()

const handleLogin = async () => {
  try {
    await login(username.value, password.value)
  } catch (err) {
    console.error('Error de login', err)
  }
}
</script>
