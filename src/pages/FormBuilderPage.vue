<template>
  <q-page class="row no-wrap" style="min-height: inherit">
    <!-- Left Sidebar: Element Palette -->
    <div style="width: 260px; flex-shrink: 0">
      <ElementPalette @add-field="addFieldByType" />
    </div>

    <!-- Center: Form Canvas -->
    <div class="col q-pa-md" style="overflow-y: auto">
      <!-- Form Name -->
      <q-input
        v-model="formName"
        outlined
        label="Form Name"
        placeholder="Enter a name for your form"
        class="q-mb-md"
        :rules="[val => !!val || 'Form name is required']"
      >
        <template #prepend>
          <q-icon name="edit" />
        </template>
      </q-input>

      <!-- Canvas -->
      <FormCanvas
        :fields="fields"
        @open-validation="openValidation"
      />

      <!-- Action Buttons -->
      <div class="row justify-end q-gutter-x-sm q-mt-lg">
        <q-btn
          flat
          label="Cancel"
          color="grey"
          icon="close"
          @click="onCancel"
        />
        <q-btn
          unelevated
          label="Save Form"
          color="primary"
          icon="save"
          :disable="!formName || fields.length === 0"
          @click="onSave"
        />
      </div>
    </div>

    <!-- Validation Dialog -->
    <ValidationDialog
      v-model="showValidationDialog"
      :field="validationField"
      @save="onValidationSave"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useFormStore } from 'src/stores/formStore'
import { createField } from 'src/constants/elementTypes'
import ElementPalette from 'src/components/ElementPalette.vue'
import FormCanvas from 'src/components/FormCanvas.vue'
import ValidationDialog from 'src/components/ValidationDialog.vue'

const props = defineProps({
  id: {
    type: String,
    default: null
  }
})

const router = useRouter()
const $q = useQuasar()
const formStore = useFormStore()

// Local state
const formId = ref(null)
const formName = ref('')
const fields = ref([])
const isEditMode = ref(false)

// Validation dialog state
const showValidationDialog = ref(false)
const validationField = ref(null)

onMounted(() => {
  if (props.id) {
    // Edit mode: load existing form
    const existing = formStore.getFormById(props.id)
    if (existing) {
      isEditMode.value = true
      formId.value = existing.id
      formName.value = existing.name
      fields.value = JSON.parse(JSON.stringify(existing.fields))
    } else {
      // Form not found, redirect to create mode
      $q.notify({ type: 'warning', message: 'Form not found. Creating a new form.' })
      initNewForm()
    }
  } else {
    initNewForm()
  }
})

function initNewForm () {
  formId.value = crypto.randomUUID()
  formName.value = ''
  fields.value = []
  isEditMode.value = false
}

function addFieldByType (type) {
  fields.value.push(createField(type))
}

function openValidation (fieldId) {
  const field = fields.value.find(f => f.id === fieldId)
  if (field) {
    validationField.value = field
    showValidationDialog.value = true
  }
}

function onValidationSave ({ validation, errorMessages }) {
  if (validationField.value) {
    const idx = fields.value.findIndex(f => f.id === validationField.value.id)
    if (idx !== -1) {
      fields.value[idx].validation = validation
      fields.value[idx].errorMessages = errorMessages
    }
  }
}

function onSave () {
  if (!formName.value) {
    $q.notify({ type: 'negative', message: 'Please enter a form name.' })
    return
  }

  if (fields.value.length === 0) {
    $q.notify({ type: 'negative', message: 'Please add at least one field.' })
    return
  }

  const now = new Date().toISOString()
  const form = {
    id: formId.value,
    name: formName.value,
    createdAt: isEditMode.value ? formStore.getFormById(formId.value)?.createdAt || now : now,
    updatedAt: now,
    fields: JSON.parse(JSON.stringify(fields.value))
  }

  if (isEditMode.value) {
    formStore.updateForm(form)
    $q.notify({ type: 'positive', message: 'Form updated successfully!' })
  } else {
    formStore.addForm(form)
    $q.notify({ type: 'positive', message: 'Form saved successfully!' })
  }

  router.push({ name: 'dashboard' })
}

function onCancel () {
  $q.dialog({
    title: 'Discard changes?',
    message: 'Any unsaved changes will be lost.',
    cancel: true,
    persistent: true
  }).onOk(() => {
    router.push({ name: 'dashboard' })
  })
}
</script>
