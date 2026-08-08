<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Dashboard</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/sales">POS</ion-button>
        <ion-button @click="handleLogout">Logout</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- ========== ADMIN VIEW ========== -->
      <template v-if="auth.isAdmin">
        <!-- Stats Cards -->
        <ion-grid>
          <ion-row>
            <ion-col size="6" size-md="3">
              <div class="stat-card blue">
                <div class="stat-icon">💊</div>
                <div class="stat-value">{{ dashboard.data?.total_medicines || 0 }}</div>
                <div class="stat-label">Total Meds</div>
              </div>
            </ion-col>
            <ion-col size="6" size-md="3">
              <div class="stat-card green">
                <div class="stat-icon">💰</div>
                <div class="stat-value">{{ money(dashboard.data?.today_sales) }}</div>
                <div class="stat-label">Today's Sales</div>
              </div>
            </ion-col>
            <ion-col size="6" size-md="3">
              <div class="stat-card orange">
                <div class="stat-icon">📅</div>
                <div class="stat-value">{{ money(dashboard.data?.weekly_sales) }}</div>
                <div class="stat-label">Last 7 Days</div>
              </div>
            </ion-col>
            <ion-col size="6" size-md="3">
              <div class="stat-card purple">
                <div class="stat-icon">📈</div>
                <div class="stat-value">{{ money(dashboard.data?.monthly_sales) }}</div>
                <div class="stat-label">This Month</div>
              </div>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6" size-md="3">
              <div class="stat-card red">
                <div class="stat-icon">⚠️</div>
                <div class="stat-value">{{ dashboard.data?.expiring_soon || 0 }}</div>
                <div class="stat-label">Expiring Soon</div>
              </div>
            </ion-col>
            <ion-col size="6" size-md="3">
              <div class="stat-card teal">
                <div class="stat-icon">🛒</div>
                <div class="stat-value">{{ recentSales.length }}</div>
                <div class="stat-label">Recent Trans.</div>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>

        <!-- Low Stock Alerts -->
        <ion-card v-if="dashboard.data?.low_stock?.length">
          <ion-card-header>
            <ion-card-title>Low Stock Alerts</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item v-for="med in dashboard.data.low_stock" :key="med.id">
                <ion-label>
                  <h2>{{ med.name }}</h2>
                  <p>Only {{ med.quantity }} left</p>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <!-- Quick Actions -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Quick Actions</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-grid>
              <ion-row>
                <ion-col size="6">
                  <ion-button expand="block" router-link="/medicines">📋 Inventory</ion-button>
                </ion-col>
                <ion-col size="6">
                  <ion-button expand="block" router-link="/sales">🛍️ New Sale</ion-button>
                </ion-col>
                <ion-col size="6">
                  <ion-button expand="block" router-link="/purchases">📦 Purchases</ion-button>
                </ion-col>
                <ion-col size="6">
                  <ion-button expand="block" router-link="/prescriptions">📄 Prescriptions</ion-button>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>

        <!-- Recent Sales -->
        <ion-card v-if="recentSales.length">
          <ion-card-header>
            <ion-card-title>Recent Sales</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item v-for="sale in recentSales" :key="sale.id">
                <ion-label>
                  <h3>#{{ sale.id }} – {{ sale.customer_name || 'Walk‑in' }}</h3>
                  <p>{{ datetime(sale.created_at) }}</p>
                </ion-label>
                <ion-note slot="end">{{ sale.total }}</ion-note>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <!-- Top Selling Medicines (bar chart) -->
        <ion-card v-if="topSellers.length">
          <ion-card-header>
            <ion-card-title>Top Sellers</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div v-for="item in topSellers" :key="item.name" class="bar-row">
              <span class="bar-label">{{ truncate(item.name, 15) }}</span>
              <div class="bar-track">
                <div class="bar-fill" :style="{ width: (item.quantity / topSellers[0].quantity) * 100 + '%' }"></div>
              </div>
              <span class="bar-value">{{ item.quantity }}</span>
            </div>
          </ion-card-content>
        </ion-card>
      </template>

      <!-- ========== PHARMACIST VIEW (Quick Sale) ========== -->
      <template v-else>
        <ion-item>
          <ion-input v-model="searchQuery" @ionInput="debouncedSearch" placeholder="Search medicines..."></ion-input>
        </ion-item>

        <ion-grid>
          <ion-row>
            <ion-col v-for="med in filteredMeds" :key="med.id" size="6" size-md="4">
              <ion-card
                @click="addToCart(med)"
                :disabled="med.quantity === 0"
                :class="{ 'low-stock': med.low_stock, 'out-of-stock': med.quantity === 0 }"
              >
                <ion-card-header>
                  <ion-card-subtitle>{{ med.category_name }}</ion-card-subtitle>
                  <ion-card-title>{{ med.name }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <p>Stock: {{ med.quantity }}</p>
                  <p>Price: {{ money(med.selling_price) }}</p>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>

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
                  <p>{{ money(item.selling_price*item.quantity) }} = {{ money((item.selling_price * item.quantity).toFixed(2)) }}</p>
                </ion-label>
                <ion-buttons slot="end">
                  <ion-button fill="clear" @click="decreaseQty(idx)">−</ion-button>
                  <span>{{ item.quantity }}</span>
                  <ion-button fill="clear" @click="increaseQty(idx)">+</ion-button>
                </ion-buttons>
              </ion-item>
            </ion-list>
            <ion-item>
              <ion-label>Total: {{ money(cartTotal) }}</ion-label>
            </ion-item>
            <ion-input v-model="customerName" placeholder="Customer name (optional)"></ion-input>
            <ion-button expand="block" @click="completeSale">Complete Sale</ion-button>
          </ion-content>
        </ion-modal>

        <!-- Floating Cart Button -->
        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button @click="showCart = true">
            <ion-icon :icon="cartIcon"></ion-icon>
          </ion-fab-button>
          <ion-badge color="danger" v-if="cart.length">{{ cart.length }}</ion-badge>
        </ion-fab>
      </template>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDashboardStore } from '@/stores/dashboard'
import { useMedicineStore } from '@/stores/medicine'
import { useSaleStore } from '@/stores/sale'
import { money, datetime, truncate } from '@/utils/formatters'
import { debounce } from '@/utils/debounce'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonList, IonItem, IonLabel, IonInput, IonFab, IonFabButton,
  IonIcon, IonBadge, IonModal, IonNote
} from '@ionic/vue'
import { cart as cartIcon } from 'ionicons/icons'

const auth = useAuthStore()
const dashboard = useDashboardStore()
const medStore = useMedicineStore()
const saleStore = useSaleStore()

// Admin data
const recentSales = ref([])

const topSellers = computed(() => {
  const medCount = {}
  recentSales.value.forEach(sale => {
    sale.items?.forEach(item => {
      const name = item.medicine_name
      medCount[name] = (medCount[name] || 0) + item.quantity
    })
  })
  return Object.entries(medCount)
    .map(([name, qty]) => ({ name, quantity: qty }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
})
const handleLogout = () => {
  auth.logout()
}

// Pharmacist data
const searchQuery = ref('')
const cart = ref([])
const customerName = ref('')
const showCart = ref(false)

const filteredMeds = computed(() => {
  if (!searchQuery.value) return medStore.medicines
  const q = searchQuery.value.toLowerCase()
  return medStore.medicines.filter(m =>
    m.name.toLowerCase().includes(q) ||
    m.brand.toLowerCase().includes(q)
  )
})

const debouncedSearch = debounce(() => medStore.fetchMedicines({ search: searchQuery.value }), 300)

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

const completeSale = async () => {
  const items = cart.value.map(i => ({
    medicine_id: i.id,
    quantity: i.quantity,
    price: i.selling_price,
  }))
  try {
    await saleStore.createSale({ items, customer_name: customerName.value })
    cart.value = []
    customerName.value = ''
    showCart.value = false
    medStore.fetchMedicines({ page_size: 1000 })
    alert('Sale completed successfully!')
  } catch (err) {
    alert(err.response?.data?.detail || 'Sale failed')
  }
}

onMounted(async () => {
  if (auth.isAdmin) {
    await dashboard.fetch()
    await saleStore.fetchSales({ page: 1, page_size: 10, ordering: '-created_at' })
    recentSales.value = saleStore.sales.slice(0, 5)
  } else {
    await medStore.fetchMedicines({ page_size: 1000 })
  }
})
</script>

<style scoped>
.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  margin: 0.3rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.stat-card.blue { border-top: 4px solid #3498db; }
.stat-card.green { border-top: 4px solid #2ecc71; }
.stat-card.orange { border-top: 4px solid #f39c12; }
.stat-card.purple { border-top: 4px solid #9b59b6; }
.stat-card.red { border-top: 4px solid #e74c3c; }
.stat-card.teal { border-top: 4px solid #1abc9c; }
.stat-icon { font-size: 1.8rem; }
.stat-value { font-size: 1.4rem; font-weight: 700; color: #2c3e50; }
.stat-label { font-size: 0.8rem; color: #7f8c8d; }

.low-stock { border-left: 4px solid #f39c12; }
.out-of-stock { opacity: 0.6; }

.bar-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.6rem;
}
.bar-label {
  width: 100px;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bar-track {
  flex: 1;
  height: 10px;
  background: #ecf0f1;
  border-radius: 5px;
  margin: 0 8px;
}
.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  border-radius: 5px;
}
.bar-value {
  font-size: 0.8rem;
  font-weight: 600;
}
</style>