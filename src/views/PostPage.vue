<template>
  <div class="container mx-auto px-4" v-if="post">
    <h1 class="text-4xl font-bold my-4">{{ post.title }}</h1>
    <p class="text-xl text-gray-500 mb-2">{{ post.subtitle }}</p>
    <img v-if="post.picture" :src="post.picture" alt="Post image" class="w-full rounded mb-4" />
    <div class="prose" v-html="post.content"></div>
    <div class="mt-4 text-sm">
      <span>Category:
        <router-link :to="`/categories/${post.category}`" class="text-blue-500 hover:underline">
          {{ post.category }}
        </router-link>
      </span>
      <br />
      <span>Author: {{ post.author }}</span>
    </div>
    
    <!-- Show Edit/Delete buttons if the logged-in user is the creator -->
    <div v-if="isCreator" class="mt-4">
      <button @click="editPost" class="mr-4 bg-green-500 text-white px-3 py-1 rounded">Edit</button>
      <button @click="deletePost" class="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
    </div>
  </div>
  <div v-else class="container mx-auto px-4">
    <p>Loading post...</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'  // Assuming you have a user store

const route = useRoute()
const router = useRouter()
const postsStore = usePostsStore()
const authStore = useAuthStore()

const postId = Number(route.params.id)

// Ensure posts are loaded
onMounted(async () => {
  if (!postsStore.posts.length) {
    await postsStore.fetchPosts()
  }
})

// Retrieve the post from the store
const post = computed(() => postsStore.posts.find(p => p.id === postId))

const isCreator = computed(() => {
  if(!authStore.user) return false
  if(post.value && authStore.user.email.trim() == post.value.email.trim()) return true
})

const editPost = () => {
  // Navigate to an edit form page for this post
  router.push(`/edit-post/${postId}`)
}

const deletePost = async () => {
  try {
    await postsStore.deletePost(postId) // Ensure your store has a deletePost action that sends the token
    router.push('/posts')
  } catch (error) {
    console.error('Error deleting post:', error)
  }
}
</script>
