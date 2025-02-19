<template>
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-3xl font-bold my-4">Edit Post</h1>
      <form @submit.prevent="updatePostHandler">
        <div class="mb-4">
          <label for="title" class="block mb-1 font-semibold">Title</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            class="w-full border px-3 py-2"
            required
          />
        </div>
        <div class="mb-4">
          <label for="subtitle" class="block mb-1 font-semibold">Subtitle</label>
          <input
            id="subtitle"
            v-model="form.subtitle"
            type="text"
            class="w-full border px-3 py-2"
          />
        </div>
        <div class="mb-4">
          <label for="description" class="block mb-1 font-semibold">Description</label>
          <textarea
            id="description"
            v-model="form.description"
            class="w-full border px-3 py-2"
            rows="2"
          ></textarea>
        </div>
        <div class="mb-4">
          <label for="content" class="block mb-1 font-semibold">Content</label>
          <textarea
            id="content"
            v-model="form.content"
            class="w-full border px-3 py-2"
            rows="6"
            required
          ></textarea>
        </div>
        <div class="mb-4">
          <label for="picture" class="block mb-1 font-semibold">Picture URL</label>
          <input
            id="picture"
            v-model="form.picture"
            type="text"
            class="w-full border px-3 py-2"
          />
        </div>
        <div class="mb-4">
          <label for="category" class="block mb-1 font-semibold">Category</label>
          <input
            id="category"
            v-model="form.category"
            type="text"
            class="w-full border px-3 py-2"
          />
        </div>
        <button type="submit" class="bg-blue-500 text-white px-4 py-2">
          Update Post
        </button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { usePostsStore } from '@/stores/posts'
  
  const route = useRoute()
  const router = useRouter()
  const postsStore = usePostsStore()
  
  const postId = Number(route.params.id)
  
  const form = ref({
    title: '',
    subtitle: '',
    description: '',
    content: '',
    picture: '',
    category: '',
  })
  
  onMounted(async () => {
    if (!postsStore.posts.length) {
      await postsStore.fetchPosts()
    }
    const post = postsStore.posts.find(p => p.id === postId)
    if (post) {
      form.value = {
        title: post.title,
        subtitle: post.subtitle,
        description: post.description,
        content: post.content,
        picture: post.picture,
        category: post.category,
        author: post.author,
        email: post.email
      }
    } else {
      router.push('/posts')
    }
  })
  
  // Handler for updating the post
  const updatePostHandler = async () => {
    try {
      await postsStore.updatePost(postId, form.value)
      router.push(`/post/${postId}`)
    } catch (error) {
      console.error('Error updating post:', error)
    }
  }
  </script>
  