<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Listado de Productos</h2>
    <p v-if="cargando" class="text-blue-700">Cargando productos...</p>
    <p v-else-if="mensajeError" class="text-red-600">{{ mensajeError }}</p>
    <table v-else class="min-w-full text-sm border border-gray-300 shadow-sm bg-white rounded">
      <thead class="bg-blue-600 text-white">
        <tr>
          <th class="p-2 border">ID</th>
          <th class="p-2 border">Nombre</th>
          <th class="p-2 border">Descripción</th>
          <th class="p-2 border">Cantidad</th>
          <th class="p-2 border">Precio</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="producto in productos" :key="producto[0]">
          <td class="p-2 border">{{ producto[0] }}</td>
          <td class="p-2 border">{{ producto[1] }}</td>
          <td class="p-2 border">{{ producto[2] }}</td>
          <td class="p-2 border">{{ producto[3] }}</td>
          <td class="p-2 border">{{ producto[4] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAuth } from '../composables/useAuth'

const productos = ref<any[]>([])
const cargando = ref(false)
const mensajeError = ref('')
const { token } = useAuth()

const cargarProductos = async () => {
  if (!token.value) {
    productos.value = []
    mensajeError.value = 'Inicia sesión para consultar el inventario.'
    return
  }
  cargando.value = true
  mensajeError.value = ''
  try {
    const res = await fetch('http://localhost:3000/productos', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (res.status === 401) {
      mensajeError.value = 'Tu sesión expiró. Inicia sesión nuevamente.'
      productos.value = []
      return
    }

    if (!res.ok) {
      throw new Error('No se pudo obtener el inventario')
    }
    productos.value = await res.json()
  } catch (err) {
    console.error('Error al obtener productos', err)
    mensajeError.value = 'No se pudieron cargar los productos. Inténtalo de nuevo.'
  } finally {
  cargando.value = false
  }
}

const handleSessionChange = () => {
  if (token.value) {
    cargarProductos()
  } else {
    productos.value = []
  }
}

onMounted(() => {
  handleSessionChange()
  window.addEventListener('productos-actualizados', cargarProductos)
  window.addEventListener('session-updated', handleSessionChange)
})

onUnmounted(() => {
  window.removeEventListener('productos-actualizados', cargarProductos)
  window.removeEventListener('session-updated', handleSessionChange)
})

watch(
  () => token.value,
  () => {
    if (token.value) {
      cargarProductos()
    } else {
      productos.value = []
    }
  }
)
</script>
