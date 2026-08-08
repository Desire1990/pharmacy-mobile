<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="login-container">
        <div class="login-header">
          <img src="../assets/logo.jpeg" alt="" width="70%" height="90%">
        </div>

        <form @submit.prevent="handleLogin">
          <ion-item>
            <ion-label position="stacked">Username</ion-label>
            <ion-input
              v-model="username"
              type="text"
              placeholder="username"
              required
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Password</ion-label>
            <ion-input
              v-model="password"
              type="password"
              placeholder="Enter your password"
              required
            ></ion-input>
          </ion-item>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <ion-button
            expand="block"
            type="submit"
            :disabled="loading"
            class="login-btn"
          >
            <ion-spinner v-if="loading" name="crescent"></ion-spinner>
            <span v-else>Sign In</span>
          </ion-button>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton, IonSpinner
} from '@ionic/vue'

const auth = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    // The auth store's login action saves the token and user, then pushes to '/'
    await auth.login({ username: username.value, password: password.value })
    // As a fallback, explicitly navigate to the dashboard
    await router.replace('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.detail || 'Invalid credentials. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 20vh auto 0;
  padding: 1rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  margin: 0;
  font-size: 2rem;
  color: var(--ion-color-primary);
}

.login-header p {
  margin: 0.5rem 0 0;
  color: var(--ion-color-medium);
}

.error-message {
  background: #ffe6e6;
  color: #e74c3c;
  padding: 0.75rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-size: 0.9rem;
  text-align: center;
}

.login-btn {
  margin-top: 1.5rem;
}

.demo-hint {
  text-align: center;
  color: var(--ion-color-medium);
  font-size: 0.8rem;
  margin-top: 2rem;
}
</style>