<template>
  <ion-modal :is-open="true" @didDismiss="dismiss">
    <ion-header>
      <ion-toolbar>
        <ion-title>Receipt</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="dismiss">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="receipt" ref="receiptRef">
        <div class="receipt-header">
          <h3>💊 SHIMA PHAR</h3>
          <p>1 Gisyo, Kanyosha-Bujumbura</p>
          <p>Tel: +257 79 462 806</p>
          <p>Email: info@shimaphar.bi</p>
          <p>NIF/TIN: 4001462136</p>
          <hr />
          <p><strong>Sale #{{ sale.id }}</strong></p>
          <p>{{ datetime(sale.created_at) }}</p>
          <p v-if="sale.customer_name">Customer: {{ sale.customer_name }}</p>
        </div>
        <table class="receipt-items">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in sale.items" :key="item.id">
              <td>{{ item.medicine_name }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ money(item.price) }}</td>
              <td>{{ money(item.price * item.quantity) }}</td>
            </tr>
          </tbody>
        </table>
        <hr />
        <div class="receipt-total">
          <span>Total</span>
          <strong>{{ money(sale.total) }}</strong>
        </div>
        <div class="receipt-footer">
          <p>Thank you for your purchase!</p>
          <p v-if="sale.user_name">Served by: {{ sale.user_name }}</p>
        </div>
      </div>
      <ion-button expand="block" @click="print">🖨️ Print</ion-button>
    </ion-content>
  </ion-modal>
</template>

<script setup>
import { ref, inject } from 'vue'
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent
} from '@ionic/vue'
import { money, datetime } from '@/utils/formatters'

defineProps({
  sale: {
    type: Object,
    required: true,
  },
})

// Get the controller instance of this modal (injected by Ionic)
const modal = inject('ion-modal')

const receiptRef = ref(null)

const dismiss = () => {
  if (modal) {
    modal.dismiss()
  }
}

const print = () => {
  const content = receiptRef.value.innerHTML
  const win = window.open('', '_blank')
  win.document.write(`
    <html>
      <head><title>Receipt</title></head>
      <style>
        body { font-family: monospace; max-width: 300px; margin: auto; }
        table { width: 100%; }
        th, td { text-align: left; }
        hr { border-top: 1px dashed #000; }
        @media print { button { display: none; } }
      </style>
      <body>${content}</body>
    </html>
  `)
  win.document.close()
  win.print()
}
</script>

<style scoped>
.receipt { font-family: 'Courier New', monospace; }
.receipt-header { text-align: center; }
.receipt-items { width: 100%; border-collapse: collapse; }
.receipt-items th { border-bottom: 1px dashed #000; }
.receipt-total { display: flex; justify-content: space-between; font-weight: bold; margin-top: 0.5rem; }
.receipt-footer { text-align: center; margin-top: 1rem; }
</style>