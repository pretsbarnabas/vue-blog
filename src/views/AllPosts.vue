<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-3xl font-bold my-4">All Posts</h1>
    <div class="mb-4 flex">
      <input 
        type="text" 
        v-model="query" 
        placeholder="Search posts by title..." 
        class="flex-grow border px-4 py-2 mr-2" 
      />
      <button @click="clearSearch" class="bg-gray-500 text-white px-4 py-2 ml-2">
        Clear
      </button>
    </div>
    
    <div 
      v-if="postsToShow.length > 0" 
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div 
        v-for="post in postsToShow" 
        :key="post.id" 
        class="border rounded p-4 shadow hover:shadow-lg transition duration-200"
      >
        <img 
          v-if="post.picture" 
          :src="post.picture" 
          alt="Post image" 
          class="w-full h-48 object-cover rounded mb-2"
        />
        <h2 class="text-xl font-semibold">{{ post.title }}</h2>
        <p class="text-gray-600">{{ post.description }}</p>
        <div class="mt-2">
          <router-link :to="`/post/${post.id}`" class="text-blue-500 hover:underline">
            Read More
          </router-link>
        </div>
      </div>
    </div>
    <div v-if="postsToShow.length === 0" class="text-gray-500">
      No posts found.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePostsStore } from '@/stores/posts'
import type { Post } from '@/types'

const postsStore = usePostsStore()
const query = ref('')

onMounted(async () => {
  await postsStore.fetchPosts()
})

const postsToShow = computed<Post[]>(() => {
  return postsStore.filteredPosts(query.value)
})

const clearSearch = () => {
  query.value = ''
}
</script>
