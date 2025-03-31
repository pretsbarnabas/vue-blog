<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card-title class="text-h3 font-weight-bold">
          Posts in category: {{ category }}
        </v-card-title>
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else-if="posts.length > 0">
      <v-col
        v-for="post in posts"
        :key="post.id"
        cols="12"
        sm="6"
      >
        <v-card
          hover
          :to="`/post/${post.id}`"
          class="h-100"
        >
          <v-card-title class="text-h5">
            {{ post.title }}
          </v-card-title>
          <v-card-subtitle class="text-body-1">
            {{ post.category }}
          </v-card-subtitle>
          <v-card-text class="text-grey-darken-1">
            {{ post.description }}
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              variant="text"
              :to="`/post/${post.id}`"
            >
              Read More
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-alert
          type="info"
          variant="tonal"
        >
          No posts found in this category.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import type { Post } from '@/types'

const route = useRoute()
const category = route.params.category as string
const posts = ref<Post[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    loading.value = true
    const { data } = await axios.get<Post[]>('http://localhost:3000/posts')
    posts.value = data.filter(post => post.category === category)
  } catch (err) {
    error.value = 'Failed to load posts'
    console.error('Error fetching posts by category:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}
.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}
</style>