<template>
  <div class="login-container p-d-flex p-jc-center p-ai-center">
    <Card class="login-card">
      <template #header>
        <img src="http://www.we-settle.com/assets/img/logo.png" alt="Logo" class="logo" />
      </template>
      <template #title> Login</template>
      <template #content>
        <form @submit.prevent="handleSubmit">
          <div class="p-field">
            <label for="userId">Email</label>
            <InputText id="userId" v-model="credentials.email" required />
          </div>
          <div class="p-field">
            <label for="password">Password</label>
            <Password id="password" v-model="credentials.password" required toggleMask />
          </div>
          <Button type="submit" label="Login" class="p-mt-3 btn" :loading="loading" />
          <Message v-if="error" severity="error" class="p-mt-3">{{ error }}</Message>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import type { LoginCredentials } from '@/types'

const authStore = useAuthStore()
const loading = ref<boolean>(false)
const error = ref<string | null>(null)

const credentials = ref<LoginCredentials>({
  email: '',
  password: '',
})

const handleSubmit = async (): Promise<void> => {
  error.value = null
  loading.value = true

  try {
    await authStore.login(credentials.value)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 400px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.p-field {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}
#userId {
  width: 100%;
}
.logo {
  width: 100px;
  height: auto;
  margin-bottom: 1rem;
}
.btn {
  background-color: #02bdc7;
}
</style>
