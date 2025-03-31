<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card-title class="text-h3 font-weight-bold">Categories</v-card-title>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-list lines="two" density="comfortable">
          <v-list-item
            v-for="category in uniqueCategories"
            :key="category"
            :to="`/categories/${category}`"
            :title="category"
            :value="category"
            active-class="text-primary"
          >
            <template v-slot:prepend>
              <v-icon icon="mdi-folder-outline"></v-icon>
            </template>

            <template v-slot:append>
              <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
          </v-list-item>
        </v-list>
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

const uniqueCategories = computed(() => postsStore.uniqueCategories)
</script>

<style scoped>
.v-list-item {
  transition: all 0.2s ease;
}
.v-list-item:hover {
  transform: translateX(5px);
}
</style>