<template>
  <div class="container mx-auto px-4">
    <h1 class="text-3xl font-bold my-4">Latest Posts</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="post in latestPosts" :key="post.id" class="border rounded p-4 shadow">
        <img v-if="post.picture" :src="post.picture" alt="Post image" class="w-full h-48 object-cover rounded mb-2"/>
        <h2 class="text-xl font-semibold">{{ post.title }}</h2>
        <p class="text-gray-600">{{ post.description }}</p>
        <div class="mt-4 text-sm">
          <span>Category:
          <router-link :to="`/categories/${post.category}`" class="text-blue-500 hover:underline">
            {{ post.category }}
          </router-link>
          </span>
        </div>
        <div class="mt-2">
          <router-link :to="`/post/${post.id}`" class="text-blue-500 hover:underline">Read more</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { usePostsStore } from '@/stores/posts'

const postsStore = usePostsStore()

// Fetch all posts when the component mounts.
onMounted(() => {
  postsStore.fetchPosts()
})

// Use the store's getter to access the latest posts.
const latestPosts = computed(() => postsStore.latestPosts)
</script>
