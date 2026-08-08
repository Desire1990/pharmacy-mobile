<template>
  <ion-page>
    <ion-header><ion-toolbar><ion-title>Purchases</ion-title></ion-toolbar></ion-header>
    <ion-content>
      <ion-list>
        <ion-item v-for="p in purchaseStore.purchases" :key="p.id">
          <ion-label>
            <h2>{{ p.medicine_name }}</h2>
            <p>{{ p.supplier_name }} – Qty: {{ p.quantity }} – Cost: {{ money(p.cost_price) }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed" v-if="auth.isAdmin">
        <ion-fab-button @click="openAdd"><ion-icon :icon="add"></ion-icon></ion-fab-button>
      </ion-fab>

      <ion-modal :is-open="showModal" @didDismiss="showModal = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>Add Purchase</ion-title>
            <ion-buttons slot="end"><ion-button @click="showModal = false">Cancel</ion-button></ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item><ion-label position="stacked">Medicine</ion-label><ion-select v-model="newPurchase.medicine"><ion-select-option v-for="m in medStore.medicines" :key="m.id" :value="m.id">{{ m.name }}</ion-select-option></ion-select></ion-item>
          <ion-item><ion-label position="stacked">Supplier</ion-label><ion-select v-model="newPurchase.supplier"><ion-select-option v-for="s in supplierStore.suppliers" :key="s.id" :value="s.id">{{ s.name }}</ion-select-option></ion-select></ion-item>
          <ion-item><ion-label position="stacked">Quantity</ion-label><ion-input v-model.number="newPurchase.quantity" type="number" required></ion-input></ion-item>
          <ion-item><ion-label position="stacked">Cost Price</ion-label><ion-input v-model.number="newPurchase.cost_price" type="number" step="0.01" required></ion-input></ion-item>
          <ion-button expand="block" @click="savePurchase">Save</ion-button>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePurchaseStore } from '@/stores/purchase'
import { useSupplierStore } from '@/stores/supplier'
import { useMedicineStore } from '@/stores/medicine'
import { useAuthStore } from '@/stores/auth'
import { money, datetime, truncate } from '@/utils/formatters'
import { add } from 'ionicons/icons'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonModal, IonButtons, IonButton, IonSelect, IonSelectOption, IonInput } from '@ionic/vue'

const purchaseStore = usePurchaseStore()
const supplierStore = useSupplierStore()
const medStore = useMedicineStore()
const auth = useAuthStore()
const showModal = ref(false)
const newPurchase = ref({ medicine: '', supplier: '', quantity: 0, cost_price: 0 })

onMounted(async () => {
  await medStore.fetchMedicines({ page_size: 1000 })
  await supplierStore.fetchSuppliers()
  purchaseStore.fetchPurchases()
})

const openAdd = () => {
  newPurchase.value = { medicine: '', supplier: '', quantity: 0, cost_price: 0 }
  showModal.value = true
}
const savePurchase = async () => {
  try {
    await purchaseStore.createPurchase(newPurchase.value)
    showModal.value = false
    purchaseStore.fetchPurchases()
  } catch (e) {
    alert(e.response?.data?.detail || 'Error')
  }
}
</script>