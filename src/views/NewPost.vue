<template>
  <div class="container mx-auto px-4">
    <h1 class="text-3xl font-bold my-4">Create New Post</h1>
    <form @submit.prevent="createPost">
      <div class="mb-4">
        <label for="title" class="block mb-1 font-semibold">Title</label>
        <input id="title" v-model="form.title" type="text" class="w-full border px-3 py-2" required />
      </div>
      <div class="mb-4">
        <label for="subtitle" class="block mb-1 font-semibold">Subtitle</label>
        <input id="subtitle" v-model="form.subtitle" type="text" class="w-full border px-3 py-2" />
      </div>
      <div class="mb-4">
        <label for="description" class="block mb-1 font-semibold">Description</label>
        <textarea id="description" v-model="form.description" class="w-full border px-3 py-2" rows="2"></textarea>
      </div>
      <div class="mb-4">
        <label for="content" class="block mb-1 font-semibold">Content</label>
        <textarea id="content" v-model="form.content" class="w-full border px-3 py-2" rows="6" required></textarea>
      </div>
      <div class="mb-4">
        <label for="picture" class="block mb-1 font-semibold">Picture URL</label>
        <input id="picture" v-model="form.picture" type="text" class="w-full border px-3 py-2" />
      </div>
      <div class="mb-4">
        <label for="category" class="block mb-1 font-semibold">Category</label>
        <input id="category" v-model="form.category" type="text" class="w-full border px-3 py-2" />
      </div>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2">Create Post</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const postsStore = usePostsStore()
const authStore = useAuthStore()
const router = useRouter()


interface NewPostForm {
  title: string
  subtitle: string
  description: string
  content: string
  picture: string
  category: string
  author: string
}

// Initialize form data
const form = ref<NewPostForm>({
  title: '',
  subtitle: '',
  description: '',
  content: '',
  picture: '',
  category: '',
  author: authStore.user.name,
  email: authStore.user.email
})


const createPost = async () => {
  try {
    // Call the store action to create a new post.
    const newPost = await postsStore.createPost(form.value)
    // Redirect to the new post's detail page.
    router.push(`/post/${newPost.id}`)
  } catch (error) {
    console.error('Error creating post:', error)
    // Optionally, add error handling or notification logic here.
  }
}
</script>
