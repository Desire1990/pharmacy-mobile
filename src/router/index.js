import { createRouter, createWebHistory } from '@ionic/vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/',
    component: () => import('@/views/TabsPage.vue'),   // contains <ion-tabs> + <ion-router-outlet>
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      {
        path: 'dashboard',
        component: () => import('@/views/DashboardPage.vue'),
      },
      {
        path: 'medicines',
        component: () => import('@/views/MedicinesPage.vue'),
      },
      {
        path: 'sales',
        component: () => import('@/views/SalesPage.vue'),
      },
      {
        path: 'sales/history',
        component: () => import('@/views/SalesHistoryPage.vue'),
      },
      {
        path: 'purchases',
        component: () => import('@/views/PurchasesPage.vue'),
      },
      {
        path: 'suppliers',
        component: () => import('@/views/SuppliersPage.vue'),
      },
      {
        path: 'prescriptions',
        component: () => import('@/views/PrescriptionsPage.vue'),
      },
      {
        path: 'users',
        component: () => import('@/views/UsersPage.vue'),
        meta: { requiresAdmin: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAdmin && !auth.isAdmin) {
    next('/') // or an unauthorized page
  } else if (to.meta.guest && auth.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router