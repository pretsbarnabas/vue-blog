<template>
  <div class="container mx-auto px-4">
    <h1 class="text-3xl font-bold my-4">Categories</h1>
    <ul class="list-disc pl-6">
      <li v-for="cat in uniqueCategories" :key="cat" class="my-2">
        <router-link :to="`/categories/${cat}`" class="text-blue-500 hover:underline">
          {{ cat }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { usePostsStore } from '@/stores/posts'

const postsStore = usePostsStore()

onMounted(() => {
  postsStore.fetchPosts()
})

const uniqueCategories = computed(() => postsStore.uniqueCategories)
</script>
