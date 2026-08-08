<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>New Sale</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openCart" v-if="cart.length">
            Cart ({{ cart.length }})
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Search medicines -->
      <ion-item>
        <ion-input
          v-model="searchQuery"
          @ionInput="debouncedSearch"
          placeholder="Search medicines..."
        ></ion-input>
      </ion-item>

      <!-- Medicine list -->
      <ion-list>
        <ion-item
          v-for="med in filteredMeds"
          :key="med.id"
          @click="addToCart(med)"
          :disabled="med.quantity === 0"
          button
        >
          <ion-label>
            <h2>{{ med.name }}</h2>
            <p>{{ med.brand }} | Batch: {{ med.batch_number }}</p>
            <p>Stock: {{ med.quantity }} | Price: BIF {{ med.selling_price }}</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <!-- Cart Modal -->
      <ion-modal :is-open="showCart" @didDismiss="showCart = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>Cart</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="showCart = false">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-list v-if="cart.length">
            <ion-item v-for="(item, idx) in cart" :key="item.id">
              <ion-label>
                <h3>{{ item.name }}</h3>
                <p>BIF {{ item.selling_price }} × {{ item.quantity }} = BIF {{ (item.selling_price * item.quantity).toFixed(2) }}</p>
              </ion-label>
              <ion-buttons slot="end">
                <ion-button fill="clear" @click="decreaseQty(idx)">−</ion-button>
                <span>{{ item.quantity }}</span>
                <ion-button fill="clear" @click="increaseQty(idx)">+</ion-button>
              </ion-buttons>
            </ion-item>
          </ion-list>
          <ion-item>
            <ion-label>Total: BIF {{ cartTotal }}</ion-label>
          </ion-item>
          <ion-input v-model="customerName" placeholder="Customer name (optional)"></ion-input>
          <ion-button expand="block" @click="completeSale" :disabled="cart.length === 0">
            Complete Sale
          </ion-button>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMedicineStore } from '@/stores/medicine'
import { useSaleStore } from '@/stores/sale'
import { debounce } from '@/utils/debounce'
import { modalController } from '@ionic/vue'
import ReceiptModal from '@/components/ReceiptBill.vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonButton, IonButtons, IonList, IonModal
} from '@ionic/vue'

const medStore = useMedicineStore()
const saleStore = useSaleStore()

const searchQuery = ref('')
const cart = ref([])
const customerName = ref('')
const showCart = ref(false)

// Filter medicines based on search
const filteredMeds = computed(() => {
  if (!searchQuery.value) return medStore.medicines
  const q = searchQuery.value.toLowerCase()
  return medStore.medicines.filter(m =>
    m.name.toLowerCase().includes(q) ||
    (m.brand && m.brand.toLowerCase().includes(q))
  )
})

const debouncedSearch = debounce(() => medStore.fetchMedicines({ search: searchQuery.value }), 300)

// Load all medicines (non‑paginated for the POS)
onMounted(() => medStore.fetchMedicines({ page_size: 1000 }))

// Cart operations
const addToCart = (med) => {
  if (med.quantity === 0) return
  const existing = cart.value.find(i => i.id === med.id)
  if (existing) {
    if (existing.quantity < med.quantity) {
      existing.quantity++
    } else {
      alert(`Only ${med.quantity} units available.`)
    }
  } else {
    cart.value.push({ ...med, quantity: 1 })
  }
  showCart.value = false
}

const decreaseQty = (idx) => {
  if (cart.value[idx].quantity > 1) cart.value[idx].quantity--
}

const increaseQty = (idx) => {
  const item = cart.value[idx]
  if (item.quantity < item.stock) {
    item.quantity++
  } else {
    alert(`Only ${item.stock} units available.`)
  }
}

const cartTotal = computed(() =>
  cart.value.reduce((sum, item) => sum + item.selling_price * item.quantity, 0).toFixed(2)
)

// Complete sale and present receipt
const completeSale = async () => {
  const items = cart.value.map(i => ({
    medicine_id: i.id,
    quantity: i.quantity,
    price: i.selling_price,
  }))

  try {
    const response = await saleStore.createSale({ items, customer_name: customerName.value })
    const saleData = response.data || response   // sale object returned by the API

    // Close the cart modal
    showCart.value = false

    // Present the receipt modal programmatically
    const modal = await modalController.create({
      component: ReceiptModal,
      componentProps: { sale: saleData },
      onWillDismiss: () => {
        // After the receipt is closed, clear the cart and refresh stock
        cart.value = []
        customerName.value = ''
        medStore.fetchMedicines({ page_size: 1000 })
      }
    })
    await modal.present()
  } catch (err) {
    alert(err.response?.data?.detail || 'Sale failed')
  }
}

const openCart = () => {
  showCart.value = true
}
</script>