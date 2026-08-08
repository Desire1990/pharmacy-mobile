<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Medicines</ion-title>
        <ion-buttons slot="end" v-if="auth.isAdmin">
          <ion-button @click="openAddModal">+ Add</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-input v-model="search" @ionInput="debouncedSearch" placeholder="Search..."></ion-input>
        <ion-select v-model="categoryFilter" @ionChange="fetchData" placeholder="All">
          <ion-select-option value="">All Categories</ion-select-option>
          <ion-select-option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</ion-select-option>
        </ion-select>
        <ion-checkbox v-model="lowStockOnly" @ionChange="fetchData">Low</ion-checkbox>
      </ion-item>

      <ion-list>
        <ion-item-sliding v-for="med in store.medicines" :key="med.id">
          <ion-item :class="{'low-stock': med.low_stock}">
            <ion-label>
              <h2>{{ med.name }}</h2>
              <p>Cost:  {{ money(med.cost_price) }} | Sell:  {{ money(med.selling_price) }} | Qty: {{ med.quantity }}</p>
              <p>Expiry: {{ dateOnly(med.expiry_date) }}</p>
            </ion-label>
          </ion-item>
          <ion-item-options side="end" v-if="auth.isAdmin">
            <ion-item-option @click="editMedicine(med)">✏️</ion-item-option>
            <ion-item-option color="danger" @click="deleteMed(med.id)">🗑️</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <ion-infinite-scroll @ionInfinite="loadMore" :disabled="!hasMore">
        <ion-infinite-scroll-content loading-text="Loading..."></ion-infinite-scroll-content>
      </ion-infinite-scroll>

      <!-- Add/Edit modal -->
      <ion-modal :is-open="showModal" @didDismiss="showModal = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ editing ? 'Edit' : 'Add' }} Medicine</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="showModal = false">Cancel</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item><ion-label position="stacked">Name *</ion-label><ion-input v-model="form.name" required></ion-input></ion-item>
          <ion-item><ion-label position="stacked">Category *</ion-label><ion-select v-model="form.category" required><ion-select-option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</ion-select-option></ion-select></ion-item>
          <ion-item><ion-label position="stacked">Brand *</ion-label><ion-input v-model="form.brand" required></ion-input></ion-item>
          <ion-item><ion-label position="stacked">Batch *</ion-label><ion-input v-model="form.batch_number" required></ion-input></ion-item>
          <ion-item><ion-label position="stacked">Cost Price *</ion-label><ion-input v-model.number="form.cost_price" type="number" step="100" required></ion-input></ion-item>
          <ion-item><ion-label position="stacked">Selling Price *</ion-label><ion-input v-model.number="form.selling_price" type="number" step="100" required></ion-input></ion-item>
          <ion-item><ion-label position="stacked">Qty *</ion-label><ion-input v-model.number="form.quantity" type="number" required></ion-input></ion-item>
          <ion-item><ion-label position="stacked">Reorder</ion-label><ion-input v-model.number="form.reorder_level" type="number"></ion-input></ion-item>
          <ion-item><ion-label position="stacked">Expiry *</ion-label><ion-datetime v-model="form.expiry_date" display-format="YYYY-MM-DD" required></ion-datetime></ion-item>
          <ion-button expand="block" @click="saveMedicine">Save</ion-button>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMedicineStore } from '@/stores/medicine'
import { useAuthStore } from '@/stores/auth'
import { getCategories } from '@/api/categories'
import { debounce } from '@/utils/debounce'
import { dateOnly } from '@/utils/formatters'
import { money, datetime, truncate } from '@/utils/formatters'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonCheckbox, IonList, IonItemSliding, IonItemOptions, IonItemOption, IonInfiniteScroll, IonInfiniteScrollContent, IonModal, IonButtons, IonButton, IonDatetime, alertController } from '@ionic/vue'

const store = useMedicineStore()
const auth = useAuthStore()

const search = ref('')
const categoryFilter = ref('')
const lowStockOnly = ref(false)
const categories = ref([])
const showModal = ref(false)
const editing = ref(null)
const form = ref({ name: '', category: '', brand: '', batch_number: '', expiry_date: '', cost_price: 0, selling_price: 0, quantity: 0, reorder_level: 10 })
const page = ref(1)
const hasMore = computed(() => store.medicines.length < store.totalCount)

const fetchData = async (reset = true) => {
  if (reset) page.value = 1
  await store.fetchMedicines({ page: page.value, search: search.value, category: categoryFilter.value, low_stock: lowStockOnly.value })
}
const debouncedSearch = debounce(() => fetchData(true), 300)
const loadMore = async (ev) => {
  page.value++
  await store.fetchMedicines({ page: page.value, search: search.value, category: categoryFilter.value, low_stock: lowStockOnly.value })
  ev.target.complete()
}

onMounted(async () => {
  const { data } = await getCategories()
  categories.value = data.results || data
  fetchData()
})

const openAddModal = () => {
  editing.value = null
  form.value = { name: '', category: '', brand: '', batch_number: '', expiry_date: '', cost_price: 0, selling_price: 0, quantity: 0, reorder_level: 10 }
  showModal.value = true
}
const editMedicine = (med) => {
  editing.value = med.id
  form.value = { ...med, category: med.category }
  showModal.value = true
}
const saveMedicine = async () => {
  try {
    if (editing.value) await store.updateMedicine(editing.value, form.value)
    else await store.createMedicine(form.value)
    showModal.value = false
    fetchData(true)
  } catch (e) {
    alert(e.response?.data?.detail || 'Error')
  }
}
const deleteMed = async (id) => {
  const alert = await alertController.create({ header: 'Confirm', message: 'Delete?', buttons: ['Cancel', { text: 'Delete', handler: () => store.deleteMedicine(id).then(() => fetchData(true)) }] })
  await alert.present()
}
</script>

<style scoped>
.low-stock { --background: #fff3f0; }
</style>