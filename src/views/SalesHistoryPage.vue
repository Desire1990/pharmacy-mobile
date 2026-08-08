<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Sales History</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-input v-model="search" @ionInput="debouncedSearch" placeholder="Search..."></ion-input>
      </ion-item>
      <ion-list>
        <ion-item v-for="sale in saleStore.sales" :key="sale.id" @click="showDetails(sale)">
          <ion-label>
            <h2>Sale #{{ sale.id }}</h2>
            <p>{{ sale.customer_name || 'Unkown' }} –  {{ money(sale.total) }}</p>
            <p>{{ datetime(sale.created_at) }}</p>
          </ion-label>
          <ion-note slot="end"> {{ money(sale.total) }}</ion-note>
        </ion-item>
      </ion-list>
      <ion-infinite-scroll @ionInfinite="loadMore" :disabled="!hasMore">
        <ion-infinite-scroll-content loading-text="Loading..."></ion-infinite-scroll-content>
      </ion-infinite-scroll>

      <!-- Details modal -->
      <ion-modal :is-open="!!selectedSale" @didDismiss="selectedSale = null">
        <ion-header>
          <ion-toolbar>
            <ion-title>Sale #{{ selectedSale?.id }}</ion-title>
            <ion-buttons slot="end"><ion-button @click="selectedSale = null">Close</ion-button></ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-list v-if="selectedSale">
            <ion-item v-for="item in selectedSale.items" :key="item.id">
              <ion-label>{{ item.medicine_name }} x{{ item.quantity }}</ion-label>
              <ion-note slot="end"> {{ money((item.price * item.quantity).toFixed(2) )}}</ion-note>
            </ion-item>
            <ion-item>
              <ion-label>Total: {{ money(selectedSale.total) }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useSaleStore } from '@/stores/sale'
import { useAuthStore } from '@/stores/auth'
import { debounce } from '@/utils/debounce'
import { datetime } from '@/utils/formatters'
import { money, truncate } from '@/utils/formatters'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonList, IonModal, IonButtons, IonButton, IonNote, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/vue'

const saleStore = useSaleStore()
const auth = useAuthStore()
const search = ref('')
const selectedSale = ref(null)
const page = ref(1)
const hasMore = computed(() => saleStore.sales.length < saleStore.totalCount)

const fetchSales = () => saleStore.fetchSales({ search: search.value, page: page.value })
const debouncedSearch = debounce(() => { page.value = 1; fetchSales() }, 300)
onMounted(() => fetchSales())
const loadMore = async (ev) => {
  page.value++
  await saleStore.fetchSales({ search: search.value, page: page.value })
  ev.target.complete()
}
const showDetails = (sale) => { selectedSale.value = sale }
</script>