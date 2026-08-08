<template>
  <ion-page>
    <ion-header><ion-toolbar><ion-title>Prescriptions</ion-title></ion-toolbar></ion-header>
    <ion-content>
      <ion-list>
        <ion-item v-for="rx in prescriptionStore.prescriptions" :key="rx.id">
          <ion-label>
            <h3>{{ rx.patient_name }} (Dr. {{ rx.doctor_name }})</h3>
            <p>Verified: {{ rx.verified ? 'Yes' : 'No' }}</p>
          </ion-label>
          <ion-thumbnail slot="end" v-if="rx.image">
            <img :src="rx.image" />
          </ion-thumbnail>
        </ion-item>
      </ion-list>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="showUpload = true"><ion-icon :icon="add"></ion-icon></ion-fab-button>
      </ion-fab>
      <ion-modal :is-open="showUpload" @didDismiss="showUpload = false">
        <ion-header><ion-toolbar><ion-title>Upload Prescription</ion-title></ion-toolbar></ion-header>
        <ion-content class="ion-padding">
          <ion-item><ion-label position="stacked">Patient Name</ion-label><ion-input v-model="patientName"></ion-input></ion-item>
          <ion-item><ion-label position="stacked">Doctor Name</ion-label><ion-input v-model="doctorName"></ion-input></ion-item>
          <ion-item><ion-label position="stacked">Notes</ion-label><ion-textarea v-model="notes"></ion-textarea></ion-item>
          <ion-item>
            <ion-label position="stacked">Image</ion-label>
            <input type="file" @change="onFileChange" accept="image/*" />
          </ion-item>
          <ion-button expand="block" @click="upload">Upload</ion-button>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePrescriptionStore } from '@/stores/prescription'
import { add } from 'ionicons/icons'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonThumbnail, IonFab, IonFabButton, IonIcon, IonModal, IonButtons, IonButton, IonInput, IonTextarea } from '@ionic/vue'

const prescriptionStore = usePrescriptionStore()
const showUpload = ref(false)
const patientName = ref('')
const doctorName = ref('')
const notes = ref('')
const file = ref(null)

onMounted(() => prescriptionStore.fetchPrescriptions())

const onFileChange = (e) => { file.value = e.target.files[0] }
const upload = async () => {
  const formData = new FormData()
  formData.append('patient_name', patientName.value)
  formData.append('doctor_name', doctorName.value)
  formData.append('notes', notes.value)
  if (file.value) formData.append('image', file.value)
  try {
    await prescriptionStore.createPrescription(formData)
    showUpload.value = false
    patientName.value = ''; doctorName.value = ''; notes.value = ''; file.value = null
    prescriptionStore.fetchPrescriptions()
  } catch (e) {
    alert(e.response?.data?.detail || 'Error')
  }
}
</script>