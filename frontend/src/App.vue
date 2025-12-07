<template>
  <div class="min-h-screen bg-slate-50 text-gray-800">
    <header class="bg-white border-b border-slate-200 shadow-sm">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <p class="text-xs text-slate-500 uppercase tracking-[0.2em]">Inventario</p>
          <h1 class="text-2xl font-extrabold text-slate-900">Panel de control</h1>
        </div>
        <div v-if="user" class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-sm font-semibold">{{ user.nombre }}</p>
            <p class="text-xs text-slate-500">Rol: {{ user.role === 'admin' ? 'Administrador' : 'Solo lectura' }}</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
            {{ user.nombre.charAt(0).toUpperCase() }}
          </div>
          <button
            class="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-sm font-semibold"
            @click="logout"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-10">
      <div v-if="!user" class="max-w-lg mx-auto">
        <LoginCard />
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div class="lg:order-1">
          <ProductList />
        </div>
        <div class="lg:order-2">
          <ProductForm v-if="isAdmin" />
          <div v-else class="bg-white p-8 rounded-2xl shadow border border-slate-200">
            <h2 class="text-xl font-bold text-slate-900 mb-2">Acceso de solo lectura</h2>
            <p class="text-slate-600">Iniciaste sesión como usuario de lectura. Solicita acceso de administrador para
              agregar o editar productos.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import LoginCard from './components/LoginCard.vue'
import ProductForm from './components/ProductForm.vue'
import ProductList from './components/ProductList.vue'
import { useAuth } from './composables/useAuth'

const { user, isAdmin, initialize, logout } = useAuth()

onMounted(() => {
  initialize()
})
</script>
