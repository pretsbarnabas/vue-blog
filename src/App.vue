<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="secondary" density="compact">
      <v-container class="d-flex align-center">
        <v-btn
          v-for="link in mainLinks"
          :key="link.to"
          :to="link.to"
          variant="text"
          :active="$route.path === link.to"
          class="mx-1"
        >
          {{ link.text }}
        </v-btn>

        <v-divider vertical class="mx-2"></v-divider>

        <template v-if="!authStore.isAuthenticated">
          <v-btn
            v-for="link in guestLinks"
            :key="link.to"
            :to="link.to"
            variant="text"
            :active="$route.path === link.to"
            class="mx-1"
          >
            {{ link.text }}
          </v-btn>
        </template>

        <template v-else>
          <v-btn
            v-for="link in authLinks"
            :key="link.to"
            :to="link.to"
            variant="text"
            :active="$route.path === link.to"
            class="mx-1"
          >
            {{ link.text }}
          </v-btn>
        </template>
      </v-container>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <router-view v-slot="{ Component }">
          <v-fade-transition mode="out-in">
            <component :is="Component" />
          </v-fade-transition>
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const $route = useRoute()

const mainLinks = ref([
  { to: '/', text: 'Kezdőlap' },
  { to: '/posts', text: 'Posts' },
  { to: '/categories', text: 'Categories' }
])

const guestLinks = ref([
  { to: '/login', text: 'Bejelentkezés' },
  { to: '/register', text: 'Regisztráció' }
])

const authLinks = ref([
  { to: '/new-post', text: 'New Post' },
  { to: '/profile', text: 'Profil' }
])
</script>

<style scoped>
.v-btn--active {
  font-weight: 600;
  color: rgb(var(--v-theme-primary)) !important;
}
</style>