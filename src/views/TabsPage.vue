<template>
  <ion-tabs>
    <ion-router-outlet></ion-router-outlet>
    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="dashboard" href="/dashboard">
        <ion-icon :icon="statsChart"></ion-icon>
        <ion-label>Dashboard</ion-label>
      </ion-tab-button>
      <ion-tab-button tab="medicines" href="/medicines">
        <ion-icon :icon="medkit"></ion-icon>
        <ion-label>Medicines</ion-label>
      </ion-tab-button>
      <ion-tab-button tab="sales" href="/sales">
        <ion-icon :icon="cart"></ion-icon>
        <ion-label>Sale</ion-label>
      </ion-tab-button>
      <ion-tab-button tab="history" href="/sales/history">
        <ion-icon :icon="receipt"></ion-icon>
        <ion-label>History</ion-label>
      </ion-tab-button>
      <ion-tab-button tab="more" @click="openMoreMenu">
        <ion-icon :icon="ellipsisHorizontal"></ion-icon>
        <ion-label>More</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs>
</template>

<script setup>
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon,
  IonRouterOutlet,
  actionSheetController
} from '@ionic/vue'
import { statsChart, medkit, cart, receipt, ellipsisHorizontal } from 'ionicons/icons'
import { useRouter } from 'vue-router'

const router = useRouter()

const openMoreMenu = async () => {
  const actionSheet = await actionSheetController.create({
    header: 'More',
    buttons: [
      { text: 'Purchases', handler: () => router.push('/purchases') },
      { text: 'Suppliers', handler: () => router.push('/suppliers') },
      { text: 'Prescriptions', handler: () => router.push('/prescriptions') },
      { text: 'Users', handler: () => router.push('/users') },
      { text: 'Cancel', role: 'cancel' },
    ],
  })
  await actionSheet.present()
}
</script>