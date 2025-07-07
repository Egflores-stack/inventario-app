<template>
  <div class="min-h-screen bg-gray-100 py-10 px-6">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <ProductForm />
      <ProductList />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductForm from './components/ProductForm.vue'
import ProductList from './components/ProductList.vue'
</script>
