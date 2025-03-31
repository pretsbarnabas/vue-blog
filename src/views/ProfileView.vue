<template>
    <v-container class="fill-height">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card class="pa-6">
            <v-card-title class="text-center text-h3 mb-6">Profil</v-card-title>
  
            <template v-if="authStore.user">
              <template v-if="!isEditing && !isChangingPassword">
                <v-list lines="two">
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon icon="mdi-account"></v-icon>
                    </template>
                    <v-list-item-title>Név</v-list-item-title>
                    <v-list-item-subtitle class="text-h6">{{ authStore.user.name }}</v-list-item-subtitle>
                  </v-list-item>
  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon icon="mdi-email"></v-icon>
                    </template>
                    <v-list-item-title>Email</v-list-item-title>
                    <v-list-item-subtitle class="text-h6">{{ authStore.user.email }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
  
                <div class="d-flex justify-center mt-6">
                  <v-btn
                    @click="startEditing"
                    color="primary"
                    prepend-icon="mdi-pencil"
                    class="mr-4"
                  >
                    Profil szerkesztése
                  </v-btn>
                  <v-btn
                    @click="startPasswordChange"
                    color="green"
                    prepend-icon="mdi-lock"
                  >
                    Jelszó módosítása
                  </v-btn>
                </div>
              </template>
  
              <v-form v-if="isEditing && !isChangingPassword" @submit.prevent="handleProfileUpdate">
                <v-text-field
                  v-model="editForm.name"
                  label="Név"
                  variant="outlined"
                  :rules="[required]"
                  class="mb-4"
                ></v-text-field>
  
                <v-text-field
                  v-model="editForm.email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  :rules="[required, emailRule]"
                  class="mb-4"
                ></v-text-field>
  
                <v-alert
                  v-if="error"
                  type="error"
                  variant="tonal"
                  class="mb-4"
                >
                  {{ error }}
                </v-alert>
  
                <div class="d-flex justify-center">
                  <v-btn
                    type="submit"
                    color="primary"
                    :loading="isLoading"
                    class="mr-4"
                  >
                    Mentés
                  </v-btn>
                  <v-btn
                    @click="cancelEditing"
                    variant="outlined"
                  >
                    Mégse
                  </v-btn>
                </div>
              </v-form>
  
              <v-form v-if="isChangingPassword" @submit.prevent="handlePasswordChange">
                <v-text-field
                  v-model="passwordForm.currentPassword"
                  label="Jelenlegi jelszó"
                  type="password"
                  variant="outlined"
                  :rules="[required]"
                  class="mb-4"
                ></v-text-field>
  
                <v-text-field
                  v-model="passwordForm.newPassword"
                  label="Új jelszó"
                  type="password"
                  variant="outlined"
                  :rules="[required, minLength]"
                  class="mb-4"
                ></v-text-field>
  
                <v-alert
                  v-if="error"
                  type="error"
                  variant="tonal"
                  class="mb-4"
                >
                  {{ error }}
                </v-alert>
  
                <div class="d-flex justify-center">
                  <v-btn
                    type="submit"
                    color="green"
                    :loading="isLoading"
                    class="mr-4"
                  >
                    Jelszó módosítása
                  </v-btn>
                  <v-btn
                    @click="cancelPasswordChange"
                    variant="outlined"
                  >
                    Mégse
                  </v-btn>
                </div>
              </v-form>
            </template>
  
            <div class="text-center mt-8">
              <v-btn
                @click="handleLogout"
                color="red"
                prepend-icon="mdi-logout"
                size="large"
              >
                Kijelentkezés
              </v-btn>
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
  
  const authStore = useAuthStore()
  const router = useRouter()
  
  const isEditing = ref(false)
  const isChangingPassword = ref(false)
  const isLoading = ref(false)
  const error = ref('')
  
  const editForm = ref({
    name: authStore.user?.name || '',
    email: authStore.user?.email || ''
  })
  
  const passwordForm = ref({
    currentPassword: '',
    newPassword: ''
  })
  
  const required = (value: string) => !!value || 'Kötelező mező'
  const emailRule = (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Érvényes email cím szükséges'
  }
  const minLength = (value: string) => value.length >= 6 || 'Legalább 6 karakter szükséges'
  
  const startEditing = () => {
    editForm.value = {
      name: authStore.user?.name || '',
      email: authStore.user?.email || ''
    }
    isEditing.value = true
    isChangingPassword.value = false
    error.value = ''
  }
  
  const cancelEditing = () => {
    isEditing.value = false
    error.value = ''
  }
  
  const handleProfileUpdate = async () => {
    try {
      error.value = ''
      isLoading.value = true
      const result = await authStore.updateProfile(editForm.value)
      if (result.success) {
        isEditing.value = false
      } else {
        error.value = 'Hiba történt a frissítés során'
      }
    } catch (e) {
      error.value = 'Váratlan hiba történt a profil frissítésekor'
    } finally {
      isLoading.value = false
    }
  }
  
  const startPasswordChange = () => {
    passwordForm.value = {
      currentPassword: '',
      newPassword: ''
    }
    isChangingPassword.value = true
    isEditing.value = false
    error.value = ''
  }
  
  const cancelPasswordChange = () => {
    isChangingPassword.value = false
    error.value = ''
  }
  
  const handlePasswordChange = async () => {
    try {
      error.value = ''
      isLoading.value = true
      const result = await authStore.changePassword(passwordForm.value)
      if (result.success) {
        isChangingPassword.value = false
        passwordForm.value = { currentPassword: '', newPassword: '' }
      } else {
        error.value = 'Hibás jelenlegi jelszó'
      }
    } catch (e) {
      error.value = 'Váratlan hiba történt a jelszó módosításakor'
    } finally {
      isLoading.value = false
    }
  }
  
  const handleLogout = () => {
    authStore.logout()
    router.push('/login')
  }
  </script>
  
  <style scoped>
  .v-card {
    transition: all 0.3s ease;
  }
  </style>