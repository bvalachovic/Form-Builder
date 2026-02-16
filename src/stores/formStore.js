import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'form-builder-forms'

function loadFromStorage () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage (forms) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(forms))
}

export const useFormStore = defineStore('forms', () => {
  const forms = ref(loadFromStorage())

  // Auto-persist on every change
  watch(forms, (val) => saveToStorage(val), { deep: true })

  function getFormById (id) {
    return forms.value.find(f => f.id === id) || null
  }

  function addForm (form) {
    forms.value.push(form)
  }

  function updateForm (updatedForm) {
    const idx = forms.value.findIndex(f => f.id === updatedForm.id)
    if (idx !== -1) {
      forms.value.splice(idx, 1, updatedForm)
    }
  }

  function deleteForm (id) {
    forms.value = forms.value.filter(f => f.id !== id)
  }

  return { forms, getFormById, addForm, updateForm, deleteForm }
})
