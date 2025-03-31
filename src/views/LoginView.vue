<template>
    <v-container class="fill-height" fluid>
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="elevation-12 pa-6">
            <v-card-title class="text-center text-h4 mb-6">
              Bejelentkezés
            </v-card-title>
  
            <v-form @submit.prevent="handleSubmit">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                :rules="[required, emailRule]"
                variant="outlined"
                class="mb-4"
                :error-messages="error"
                required
              ></v-text-field>
  
              <v-text-field
                v-model="password"
                label="Jelszó"
                type="password"
                :rules="[required]"
                variant="outlined"
                class="mb-4"
                :error="!!error"
                required
              ></v-text-field>
  
              <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                class="mb-4"
              >
                {{ error }}
              </v-alert>
  
              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="isLoading"
                :disabled="isLoading"
              >
                <span v-if="!isLoading">Bejelentkezés</span>
              </v-btn>
            </v-form>
  
            <v-divider class="my-6"></v-divider>
  
            <div class="text-center">
              <span class="text-caption text-grey-darken-1">
                Még nincs fiókod?
              </span>
              <router-link
                to="/register"
                class="text-primary text-decoration-none ml-1"
              >
                Regisztrálj itt!
              </router-link>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  import { useRouter } from 'vue-router'
  import type { LoginCredentials } from '@/types/auth'
  
  const email = ref('')
  const password = ref('')
  const error = ref('')
  const isLoading = ref(false)
  
  const authStore = useAuthStore()
  const router = useRouter()
  
  const required = (value: string) => !!value || 'Kötelező mező'
  const emailRule = (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Érvényes email cím szükséges'
  }
  
  const handleSubmit = async () => {
    try {
      error.value = ''
      isLoading.value = true
  
      const credentials: LoginCredentials = {
        email: email.value,
        password: password.value
      }
  
      const result = await authStore.login(credentials)
  
      if (result.success) {
        router.push('/profile')
      } else {
        error.value = 'Hibás email vagy jelszó'
      }
    } catch (e) {
      error.value = 'Váratlan hiba történt. Kérjük, próbáld újra később.'
    } finally {
      isLoading.value = false
    }
  }
  </script>
  
  <style scoped>
  .v-card {
    transition: all 0.3s ease;
  }
  </style>