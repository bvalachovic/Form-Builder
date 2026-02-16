<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="min-width: 500px; max-width: 600px">
      <q-card-section>
        <div class="text-h6">Validation Rules</div>
        <div class="text-caption text-grey">{{ field?.label || 'Field' }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-gutter-y-sm" style="max-height: 60vh; overflow-y: auto">
        <!-- Required -->
        <div v-if="applicableRules.includes('required')">
          <q-toggle v-model="localValidation.required" label="Required" />
          <q-input
            v-if="localValidation.required"
            v-model="localErrors.required"
            dense
            outlined
            label="Error message"
            class="q-ml-lg"
          />
        </div>

        <!-- Min Length -->
        <div v-if="applicableRules.includes('minLength')">
          <div class="row items-center q-gutter-x-sm">
            <span class="text-body2">Minimum Length</span>
            <q-input
              v-model.number="localValidation.minLength"
              dense
              outlined
              type="number"
              style="max-width: 100px"
              clearable
            />
          </div>
          <q-input
            v-if="localValidation.minLength"
            v-model="localErrors.minLength"
            dense
            outlined
            label="Error message"
            hint="Use {n} for the value"
            class="q-ml-lg q-mt-xs"
          />
        </div>

        <!-- Max Length -->
        <div v-if="applicableRules.includes('maxLength')">
          <div class="row items-center q-gutter-x-sm">
            <span class="text-body2">Maximum Length</span>
            <q-input
              v-model.number="localValidation.maxLength"
              dense
              outlined
              type="number"
              style="max-width: 100px"
              clearable
            />
          </div>
          <q-input
            v-if="localValidation.maxLength"
            v-model="localErrors.maxLength"
            dense
            outlined
            label="Error message"
            hint="Use {n} for the value"
            class="q-ml-lg q-mt-xs"
          />
        </div>

        <!-- Min Value -->
        <div v-if="applicableRules.includes('min')">
          <div class="row items-center q-gutter-x-sm">
            <span class="text-body2">Minimum Value</span>
            <q-input
              v-model.number="localValidation.min"
              dense
              outlined
              type="number"
              style="max-width: 100px"
              clearable
            />
          </div>
          <q-input
            v-if="localValidation.min != null"
            v-model="localErrors.min"
            dense
            outlined
            label="Error message"
            hint="Use {n} for the value"
            class="q-ml-lg q-mt-xs"
          />
        </div>

        <!-- Max Value -->
        <div v-if="applicableRules.includes('max')">
          <div class="row items-center q-gutter-x-sm">
            <span class="text-body2">Maximum Value</span>
            <q-input
              v-model.number="localValidation.max"
              dense
              outlined
              type="number"
              style="max-width: 100px"
              clearable
            />
          </div>
          <q-input
            v-if="localValidation.max != null"
            v-model="localErrors.max"
            dense
            outlined
            label="Error message"
            hint="Use {n} for the value"
            class="q-ml-lg q-mt-xs"
          />
        </div>

        <!-- Pattern -->
        <div v-if="applicableRules.includes('pattern')">
          <div class="row items-center q-gutter-x-sm">
            <span class="text-body2">Pattern (Regex)</span>
            <q-input
              v-model="localValidation.pattern"
              dense
              outlined
              placeholder="e.g. ^[A-Za-z]+$"
              class="col"
              clearable
            />
          </div>
          <q-input
            v-if="localValidation.pattern"
            v-model="localErrors.pattern"
            dense
            outlined
            label="Error message"
            class="q-ml-lg q-mt-xs"
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="grey" v-close-popup @click="onCancel" />
        <q-btn unelevated label="Save Rules" color="primary" @click="onSave" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { VALIDATION_MAP } from 'src/constants/elementTypes'

const props = defineProps({
  modelValue: Boolean,
  field: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

const localValidation = ref({})
const localErrors = ref({})

const applicableRules = computed(() => {
  if (!props.field) return []
  return VALIDATION_MAP[props.field.type] || []
})

// Deep-clone field data when dialog opens
watch(() => props.modelValue, (open) => {
  if (open && props.field) {
    localValidation.value = JSON.parse(JSON.stringify(props.field.validation))
    localErrors.value = JSON.parse(JSON.stringify(props.field.errorMessages))
  }
})

function onCancel () {
  emit('update:modelValue', false)
}

function onSave () {
  emit('save', {
    validation: JSON.parse(JSON.stringify(localValidation.value)),
    errorMessages: JSON.parse(JSON.stringify(localErrors.value))
  })
  emit('update:modelValue', false)
}
</script>
