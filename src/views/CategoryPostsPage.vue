<template>
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold my-4">Posts in category: {{ category }}</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="post in posts" :key="post.id" class="border rounded p-4 shadow">
          <h2 class="text-xl font-semibold">{{ post.title }}</h2>
          <p class="text-gray-600">{{ post.description }}</p>
          <div class="mt-2">
            <router-link :to="`/post/${post.id}`" class="text-blue-500 hover:underline">Read more</router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'
  import { Post } from '@/types'
  
  const route = useRoute()
  const category = route.params.category as string
  const posts = ref<Post[]>([])
  
  onMounted(async () => {
    try {
      const { data } = await axios.get<Post[]>(`http://localhost:3000/posts`)
      const filter = data.filter(d=>d.category === category)
      posts.value = filter
    } catch (error) {
      console.error('Error fetching posts by category:', error)
    }
  })
  </script>
  