<template>
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="elevation-12 pa-6">
            <v-card-title class="text-center text-h3 mb-6">
              Regisztráció
            </v-card-title>
  
            <v-form @submit.prevent="handleSubmit">
              <v-text-field
                v-model="name"
                label="Név"
                variant="outlined"
                :rules="[required]"
                class="mb-4"
                :error-messages="error"
              ></v-text-field>
  
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                variant="outlined"
                :rules="[required, emailRule]"
                class="mb-4"
                :error="!!error"
              ></v-text-field>
  
              <v-text-field
                v-model="password"
                label="Jelszó"
                type="password"
                variant="outlined"
                :rules="[required, minLength]"
                class="mb-4"
                :error="!!error"
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
                <span v-if="!isLoading">Regisztráció</span>
              </v-btn>
            </v-form>
  
            <v-divider class="my-6"></v-divider>
  
            <div class="text-center">
              <span class="text-caption text-grey-darken-1">
                Már van fiókod?
              </span>
              <router-link
                to="/login"
                class="text-primary text-decoration-none ml-1"
              >
                Jelentkezz be itt!
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
  import type { RegisterCredentials } from '@/types/auth'
  
  const name = ref('')
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
  const minLength = (value: string) => value.length >= 6 || 'Legalább 6 karakter szükséges'
  
  const handleSubmit = async () => {
    try {
      error.value = ''
      isLoading.value = true
  
      const credentials: RegisterCredentials = {
        name: name.value,
        email: email.value,
        password: password.value
      }
  
      const result = await authStore.register(credentials)
  
      if (result.success) {
        router.push('/profile')
      } else {
        error.value = 'Regisztrációs hiba történt'
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