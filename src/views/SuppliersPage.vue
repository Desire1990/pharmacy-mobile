<template>
  <ion-page>
    <ion-header><ion-toolbar><ion-title>Suppliers</ion-title></ion-toolbar></ion-header>
    <ion-content>
      <ion-list>
        <ion-item v-for="s in supplierStore.suppliers" :key="s.id">
          <ion-label>{{ s.name }} – {{ s.phone }}</ion-label>
          <ion-buttons slot="end" v-if="auth.isAdmin">
            <ion-button fill="clear" @click="editSupplier(s)">✏️</ion-button>
            <ion-button fill="clear" color="danger" @click="deleteSupplier(s.id)">🗑️</ion-button>
          </ion-buttons>
        </ion-item>
      </ion-list>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed" v-if="auth.isAdmin">
        <ion-fab-button @click="openAdd"><ion-icon :icon="add"></ion-icon></ion-fab-button>
      </ion-fab>
      <ion-modal :is-open="showModal" @didDismiss="showModal = false">
        <ion-header><ion-toolbar><ion-title>{{ editing ? 'Edit' : 'Add' }} Supplier</ion-title></ion-toolbar></ion-header>
        <ion-content class="ion-padding">
          <ion-item><ion-label position="stacked">Name</ion-label><ion-input v-model="form.name" required></ion-input></ion-item>
          <ion-item><ion-label position="stacked">Contact Person</ion-label><ion-input v-model="form.contact_person"></ion-input></ion-item>
          <ion-item><ion-label position="stacked">Phone</ion-label><ion-input v-model="form.phone" required></ion-input></ion-item>
          <ion-item><ion-label position="stacked">Email</ion-label><ion-input v-model="form.email"></ion-input></ion-item>
          <ion-item><ion-label position="stacked">Address</ion-label><ion-input v-model="form.address"></ion-input></ion-item>
          <ion-button expand="block" @click="saveSupplier">Save</ion-button>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupplierStore } from '@/stores/supplier'
import { useAuthStore } from '@/stores/auth'
import { add } from 'ionicons/icons'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButtons, IonButton, IonFab, IonFabButton, IonIcon, IonModal, IonInput, alertController } from '@ionic/vue'

const supplierStore = useSupplierStore()
const auth = useAuthStore()
const showModal = ref(false)
const editing = ref(null)
const form = ref({ name: '', contact_person: '', phone: '', email: '', address: '' })

onMounted(() => supplierStore.fetchSuppliers())

const openAdd = () => {
  editing.value = null
  form.value = { name: '', contact_person: '', phone: '', email: '', address: '' }
  showModal.value = true
}
const editSupplier = (s) => {
  editing.value = s.id
  form.value = { ...s }
  showModal.value = true
}
const saveSupplier = async () => {
  try {
    if (editing.value) await supplierStore.updateSupplier(editing.value, form.value)
    else await supplierStore.createSupplier(form.value)
    showModal.value = false
    supplierStore.fetchSuppliers()
  } catch (e) {
    alert(e.response?.data?.detail || 'Error')
  }
}
const deleteSupplier = async (id) => {
  const alert = await alertController.create({ header: 'Delete', message: 'Are you sure?', buttons: ['No', { text: 'Yes', handler: () => { supplierStore.deleteSupplier(id).then(() => supplierStore.fetchSuppliers()) } }] })
  await alert.present()
}
</script>