<template>
  <ion-page>
    <ion-header><ion-toolbar><ion-title>Users</ion-title></ion-toolbar></ion-header>
    <ion-content>
      <ion-list>
        <ion-item v-for="user in userStore.users" :key="user.id">
          <ion-label>{{ user.username }} ({{ user.role }})</ion-label>
          <ion-buttons slot="end">
            <ion-button fill="clear" @click="editUser(user)">✏️</ion-button>
            <ion-button fill="clear" color="danger" @click="deleteUser(user.id)">🗑️</ion-button>
          </ion-buttons>
        </ion-item>
      </ion-list>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="openAdd"><ion-icon :icon="add"></ion-icon></ion-fab-button>
      </ion-fab>
      <ion-modal :is-open="showModal" @didDismiss="showModal = false">
        <!-- similar form to web, using ion-input for username, email, password, role -->
        <ion-header><ion-toolbar><ion-title>{{ editing ? 'Edit' : 'Add' }} User</ion-title></ion-toolbar></ion-header>
        <ion-content class="ion-padding">
          <ion-item><ion-label position="stacked">Username</ion-label><ion-input v-model="userForm.username" required></ion-input></ion-item>
          <ion-item v-if="!editing"><ion-label position="stacked">Password</ion-label><ion-input v-model="userForm.password" type="password" required></ion-input></ion-item>
          <ion-item><ion-label position="stacked">Email</ion-label><ion-input v-model="userForm.email" type="email" required></ion-input></ion-item>
          <ion-item><ion-label position="stacked">First Name</ion-label><ion-input v-model="userForm.first_name"></ion-input></ion-item>
          <ion-item><ion-label position="stacked">Last Name</ion-label><ion-input v-model="userForm.last_name"></ion-input></ion-item>
          <ion-item><ion-label position="stacked">Role</ion-label><ion-select v-model="userForm.role"><ion-select-option value="admin">Admin</ion-select-option><ion-select-option value="pharmacist">Pharmacist</ion-select-option></ion-select></ion-item>
          <ion-button expand="block" @click="saveUser">Save</ion-button>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { add } from 'ionicons/icons'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButtons, IonButton, IonFab, IonFabButton, IonIcon, IonModal, IonInput, IonSelect, IonSelectOption, alertController } from '@ionic/vue'

const userStore = useUserStore()
const showModal = ref(false)
const editing = ref(null)
const userForm = reactive({ username: '', email: '', password: '', first_name: '', last_name: '', role: 'pharmacist' })

onMounted(() => userStore.fetchUsers())

const openAdd = () => {
  editing.value = null
  Object.assign(userForm, { username: '', email: '', password: '', first_name: '', last_name: '', role: 'pharmacist' })
  showModal.value = true
}
const editUser = (user) => {
  editing.value = user.id
  Object.assign(userForm, user)
  showModal.value = true
}
const saveUser = async () => {
  try {
    if (editing.value) await userStore.updateUser(editing.value, userForm)
    else await userStore.createUser(userForm)
    showModal.value = false
    userStore.fetchUsers()
  } catch (e) {
    alert(e.response?.data?.detail || 'Error')
  }
}
const deleteUser = async (id) => {
  const alert = await alertController.create({ header: 'Delete', message: 'Are you sure?', buttons: ['No', { text: 'Yes', handler: () => userStore.deleteUser(id) }] })
  await alert.present()
}
</script>