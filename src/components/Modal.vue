<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({ show: Boolean })
const emit = defineEmits(['close'])
const close = () => emit('close')
</script>
<style scoped>
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.modal-content {
  background: white; padding: 2rem; border-radius: 8px; min-width: 400px;
  position: relative;
}
.close-btn { position: absolute; top: 0.5rem; right: 0.5rem; font-size: 1.5rem; background: none; border: none; cursor: pointer; }
</style>