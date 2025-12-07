<template>
  <form @submit.prevent="agregarProducto" class="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg border border-blue-200 w-full max-w-lg mx-auto mt-8">
    <h2 class="text-3xl font-extrabold text-center text-blue-800 mb-8 tracking-tight">Agregar Producto</h2>

    <div class="space-y-5">
      <div class="flex items-center">
        <label class="w-32 text-base font-semibold text-blue-700">Nombre</label>
        <input v-model="producto.nombre" type="text" class="flex-1 border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
      </div>

      <div class="flex items-center">
        <label class="w-32 text-base font-semibold text-blue-700">Descripción</label>
        <input v-model="producto.descripcion" type="text" class="flex-1 border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
      </div>

      <div class="flex items-center">
        <label class="w-32 text-base font-semibold text-blue-700">Cantidad</label>
        <input v-model.number="producto.cantidad" type="number" class="flex-1 border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
      </div>

      <div class="flex items-center">
        <label class="w-32 text-base font-semibold text-blue-700">Precio</label>
        <input v-model.number="producto.precio" type="number" class="flex-1 border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
      </div>
    </div>

    <button
      type="submit"
      class="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 shadow transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="enviando"
    >
      {{ enviando ? 'Guardando...' : 'Guardar' }}
    </button>

    <p v-if="mensaje" class="mt-6 text-center text-green-600 font-semibold text-base">{{ mensaje }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const producto = ref({
  nombre: '',
  descripcion: '',
  cantidad: 0,
  precio: 0
})

const mensaje = ref('')
const enviando = ref(false)
const { token } = useAuth()

const agregarProducto = async () => {
  try {
    if (!token.value) {
      mensaje.value = '❌ Debes iniciar sesión nuevamente'
      return
    }
    enviando.value = true
    const res = await fetch('http://localhost:3000/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`
      },
      body: JSON.stringify(producto.value)
    })

    if (res.ok) {
      mensaje.value = '✅ Producto agregado correctamente'
      producto.value = { nombre: '', descripcion: '', cantidad: 0, precio: 0 }
      window.dispatchEvent(new CustomEvent('productos-actualizados'))
    } else {
      const body = await res.json().catch(() => ({}))
      mensaje.value = body.message ? `❌ ${body.message}` : '❌ Error al agregar el producto'
    }
  } catch (err) {
    console.error('Error al guardar:', err)
    mensaje.value = '❌ Error de conexión con el servidor'
  } finally {
    enviando.value = false
  }
}
</script>
