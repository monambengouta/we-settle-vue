<template>
  <div class="validation-container">
    <Toolbar class="p-mb-4">
      <template #start>
        <h2>Inscription Validation</h2>
      </template>
      <template #end>
        <Button label="Logout" icon="pi pi-sign-out" @click="logout" class="btn" />
      </template>
    </Toolbar>

    <DataTable :value="inscriptions" :loading="loading" stripedRows>
      <Column field="name" header="First Name"></Column>
      <Column field="lastname" header="Last Name"></Column>
      <Column field="email" header="Email"></Column>
      <Column field="validated" header="Status">
        <template #body="{ data }: { data: Inscription }">
          <Tag
            :value="data.validated ? 'Validated' : 'Pending'"
            :severity="data.validated ? 'success' : 'warning'"
            class="tag"
          />
        </template>
      </Column>
      <Column field="validation_date" header="Validation Date">
        <template #body="{ data }: { data: Inscription }">
          {{ formatDate(data.validation_date) }}
        </template>
      </Column>
      <Column header="Actions">
        <template #body="{ data }: { data: Inscription }">
          <div class="p-d-flex p-gap- actions">
            <Button
              icon="pi pi-check"
              :disabled="data.validated"
              @click="validateInscription(data.id)"
              v-tooltip="'Validate this inscription'"
              class="p-button"
            >
              Validate
            </Button>
            <Button
              icon="pi pi-key"
              :disabled="!data.validated"
              @click="generateToken(data.id)"
              v-tooltip="'Generate and send bearer token'"
              class="p-button"
            >
              Send Token
            </Button>
          </div>
        </template>
      </Column>
    </DataTable>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'
import type { Inscription } from '@/types'

// PrimeVue components
import Toolbar from 'primevue/toolbar'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Toast from 'primevue/toast'
import { useApi } from '@/utils/axios-backend'

const authStore = useAuthStore()
const api = useApi()
const toast = useToast()

const inscriptions = ref<Inscription[]>([])
const loading = ref<boolean>(false)

onMounted(async (): Promise<void> => {
  await fetchInscriptions()
})

const fetchInscriptions = async (): Promise<void> => {
  loading.value = true
  try {
    inscriptions.value = await api.getInscriptions()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error instanceof Error ? error.message : 'Failed to fetch inscriptions',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

const validateInscription = async (subId: string): Promise<void> => {
  try {
    await api.validateInscription(subId)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Inscription validated successfully',
      life: 3000,
    })
    await fetchInscriptions()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error instanceof Error ? error.message : 'Validation failed',
      life: 3000,
    })
  }
}

const generateToken = async (userId: string): Promise<void> => {
  try {
    await api.generateToken(userId)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Token generated and sent successfully',
      life: 3000,
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error instanceof Error ? error.message : 'Token generation failed',
      life: 3000,
    })
  }
}

const logout = (): void => {
  authStore.logout()
}

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString()
}
</script>

<style scoped>
.validation-container {
  padding: 2rem;
}
.p-button {
  width: 100px;
  text-align: center;
  margin-right: 4px;
  background-color: #02bdc7;
}

.btn {
  background-color: #02bdc7;
}

.tag {
  background-color: #02bdc7;
  color: white;
}
</style>
