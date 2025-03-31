<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card-title class="text-h3 font-weight-bold">Edit Post</v-card-title>
      </v-col>
    </v-row>

    <v-card class="pa-6">
      <v-form @submit.prevent="updatePostHandler">
        <v-text-field
          v-model="form.title"
          label="Title"
          variant="outlined"
          :rules="[required]"
          class="mb-4"
        ></v-text-field>

        <v-text-field
          v-model="form.subtitle"
          label="Subtitle"
          variant="outlined"
          class="mb-4"
        ></v-text-field>

        <v-textarea
          v-model="form.description"
          label="Description"
          variant="outlined"
          rows="2"
          class="mb-4"
        ></v-textarea>

        <v-textarea
          v-model="form.content"
          label="Content"
          variant="outlined"
          rows="6"
          :rules="[required]"
          class="mb-4"
        ></v-textarea>

        <v-text-field
          v-model="form.picture"
          label="Picture URL"
          variant="outlined"
          class="mb-4"
        ></v-text-field>

        <v-text-field
          v-model="form.category"
          label="Category"
          variant="outlined"
          class="mb-4"
        ></v-text-field>

        <div class="d-flex justify-end">
          <v-btn
            type="submit"
            color="primary"
            size="large"
            :loading="loading"
          >
            Update Post
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts'

const route = useRoute()
const router = useRouter()
const postsStore = usePostsStore()
const loading = ref(false)

const postId = Number(route.params.id)

const form = ref({
  title: '',
  subtitle: '',
  description: '',
  content: '',
  picture: '',
  category: '',
  author: '',
  email: ''
})

const required = (value: string) => !!value || 'This field is required'

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

const updatePostHandler = async () => {
  try {
    loading.value = true
    await postsStore.updatePost(postId, form.value)
    router.push(`/post/${postId}`)
  } catch (error) {
    console.error('Error updating post:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}
</style>