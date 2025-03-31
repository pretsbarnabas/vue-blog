<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card-title class="text-h3 font-weight-bold">Latest Posts</v-card-title>
      </v-col>
    </v-row>

    <v-row v-if="postsStore.loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="post in latestPosts"
        :key="post.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          hover
          class="h-100"
        >
        <v-img
          v-if="post.picture"
          :src="post.picture"
          :alt="post.title"
          height="200"
          cover
          class="post-image"
          gradient="to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3)"
          position="center center"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-row>
          </template>
        </v-img>

          <v-card-item>
            <v-card-title>{{ post.title }}</v-card-title>
            <v-card-subtitle class="text-grey-darken-1">
              {{ post.description }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text v-if="post.category">
            <span class="text-caption">Category: </span>
            <router-link 
              :to="`/categories/${post.category}`"
              class="text-primary text-decoration-none"
            >
              {{ post.category }}
            </router-link>
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
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { usePostsStore } from '@/stores/posts'

const postsStore = usePostsStore()

onMounted(() => {
  postsStore.fetchPosts()
})

const latestPosts = computed(() => postsStore.latestPosts)
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}
.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

.post-image {
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 1px solid #eee;
}

.post-image:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

</style>