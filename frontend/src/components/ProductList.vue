<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Listado de Productos</h2>
    <table class="min-w-full text-sm border border-gray-300 shadow-sm bg-white rounded">
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
import { ref, onMounted } from 'vue'

const productos = ref<any[]>([])

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/productos')
    productos.value = await res.json()
  } catch (err) {
    console.error('Error al obtener productos', err)
  }
})
</script>
