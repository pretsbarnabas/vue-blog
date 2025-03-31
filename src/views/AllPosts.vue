<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card-title class="text-h3 font-weight-bold">All Posts</v-card-title>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12" sm="10">
        <v-text-field
          v-model="query"
          placeholder="Search posts by title..."
          variant="outlined"
          clearable
          @click:clear="clearSearch"
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-btn
          @click="clearSearch"
          color="grey-darken-1"
          variant="flat"
          block
          height="56"
        >
          Clear
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="postsToShow.length > 0">
      <v-col
        v-for="post in postsToShow"
        :key="post.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          class="h-100"
          hover
          :to="`/post/${post.id}`"
        >
          <v-img
            v-if="post.picture"
            :src="post.picture"
            :alt="post.title"
            height="200"
            cover
            class="align-end"
          >
            <v-card-title class="text-white text-shadow">
              {{ post.title }}
            </v-card-title>
          </v-img>
          <v-card-text>
            <p class="text-body-1 text-grey-darken-1">
              {{ post.description }}
            </p>
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
          No posts found.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
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

<style scoped>
.text-shadow {
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
}
.v-card {
  transition: all 0.3s ease;
}
.v-card:hover {
  transform: translateY(-5px);
}
</style>