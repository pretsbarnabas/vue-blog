<template>
  <v-container>
    <template v-if="post">
      <v-row>
        <v-col cols="12">
          <v-card-title class="text-h2 font-weight-bold">{{ post.title }}</v-card-title>
          <v-card-subtitle class="text-h5 text-grey-darken-1">{{ post.subtitle }}</v-card-subtitle>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-img
            v-if="post.picture"
            :src="post.picture"
            :alt="post.title"
            class="rounded-lg mb-4 content-center items-center"
            max-height="720"
            max-width="480"
            cover
          ></v-img>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card-text class="prose" v-html="post.content"></v-card-text>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-chip-group>
            <v-chip
              :to="`/categories/${post.category}`"
              variant="outlined"
              color="primary"
              size="small"
            >
              {{ post.category }}
            </v-chip>
            <v-chip variant="text" size="small">
              <v-icon start>mdi-account</v-icon>
              {{ post.author }}
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>

      <v-row v-if="isCreator">
        <v-col cols="12" class="d-flex">
          <v-btn
            @click="editPost"
            color="green"
            variant="flat"
            class="mr-4"
            prepend-icon="mdi-pencil"
          >
            Edit
          </v-btn>
          <v-btn
            @click="deletePost"
            color="red"
            variant="flat"
            prepend-icon="mdi-delete"
          >
            Delete
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <v-row v-else>
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const postsStore = usePostsStore()
const authStore = useAuthStore()

const postId = Number(route.params.id)

onMounted(async () => {
  if (!postsStore.posts.length) {
    await postsStore.fetchPosts()
  }
})

const post = computed(() => postsStore.posts.find(p => p.id === postId))

const isCreator = computed(() => {
  if (!authStore.user) return false
  if (post.value && authStore.user.email?.trim() === post.value.email?.trim()) return true
  return false
})

const editPost = () => {
  router.push(`/edit-post/${postId}`)
}

const deletePost = async () => {
  try {
    router.push('/posts')
    await postsStore.deletePost(postId)
  } catch (error) {
  }
}
</script>

<style scoped>
.prose :deep(*) {
  max-width: 100%;
  line-height: 1.6;
  margin-bottom: 1rem;
}
.prose :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
}
.prose :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
}
</style>