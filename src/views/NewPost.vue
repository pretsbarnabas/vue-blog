<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card-title class="text-h3 font-weight-bold">Create New Post</v-card-title>
      </v-col>
    </v-row>

    <v-card class="pa-6">
      <v-form @submit.prevent="createPost">
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
          :items="postsStore.uniqueCategories"
          class="mb-4"
        ></v-text-field>

        <div class="d-flex justify-end">
          <v-btn
            type="submit"
            color="primary"
            size="large"
            :loading="loading"
          >
            Create Post
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const postsStore = usePostsStore()
const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)

interface NewPostForm {
  title: string
  subtitle: string
  description: string
  content: string
  picture: string
  category: string
  author: string
  email: string
}

const form = ref<NewPostForm>({
  title: '',
  subtitle: '',
  description: '',
  content: '',
  picture: '',
  category: '',
  author: authStore.user?.name || '',
  email: authStore.user?.email || ''
})

const required = (value: string) => !!value || 'This field is required'

const createPost = async () => {
  try {
    loading.value = true
    const newPost = await postsStore.createPost(form.value)
    router.push(`/post/${newPost.id}`)
  } catch (error) {
    console.error('Error creating post:', error)
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