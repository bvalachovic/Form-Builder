<template>
  <div class="form-renderer">
    <div class="text-h5 q-mb-md">{{ form.name }}</div>
    <q-separator class="q-mb-lg" />

    <q-form class="q-gutter-md">
      <div v-for="field in form.fields" :key="field.id">
        <!-- Text / Email / Number -->
        <q-input
          v-if="['text', 'email', 'number'].includes(field.type)"
          v-model="formData[field.id]"
          :label="field.label"
          :placeholder="field.placeholder"
          :type="field.type === 'number' ? 'number' : 'text'"
          :rules="buildRules(field)"
          outlined
          lazy-rules
        />

        <!-- Textarea -->
        <q-input
          v-else-if="field.type === 'textarea'"
          v-model="formData[field.id]"
          :label="field.label"
          :placeholder="field.placeholder"
          type="textarea"
          :rules="buildRules(field)"
          outlined
          lazy-rules
          rows="3"
        />

        <!-- Date Picker -->
        <q-input
          v-else-if="field.type === 'date'"
          v-model="formData[field.id]"
          :label="field.label"
          :rules="buildRules(field)"
          outlined
          lazy-rules
          mask="date"
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="formData[field.id]" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <!-- Select -->
        <q-select
          v-else-if="field.type === 'select'"
          v-model="formData[field.id]"
          :label="field.label"
          :options="field.options"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          :rules="buildRules(field)"
          outlined
          lazy-rules
        />

        <!-- Radio Group -->
        <div v-else-if="field.type === 'radio'">
          <div class="text-body2 q-mb-xs">{{ field.label }}</div>
          <q-option-group
            v-model="formData[field.id]"
            :options="field.options"
            type="radio"
          />
          <div
            v-if="field.validation.required && formData[field.id] == null"
            class="text-negative text-caption q-mt-xs"
          >
            {{ field.errorMessages.required }}
          </div>
        </div>

        <!-- Checkbox Group -->
        <div v-else-if="field.type === 'checkbox'">
          <div class="text-body2 q-mb-xs">{{ field.label }}</div>
          <q-option-group
            v-model="formData[field.id]"
            :options="field.options"
            type="checkbox"
          />
        </div>

        <!-- Toggle -->
        <q-toggle
          v-else-if="field.type === 'toggle'"
          v-model="formData[field.id]"
          :label="field.label"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  }
})

const formData = ref({})

// Initialize form data when form changes
watch(() => props.form, (form) => {
  if (!form) return
  const data = {}
  form.fields.forEach(field => {
    switch (field.type) {
      case 'checkbox':
        data[field.id] = []
        break
      case 'toggle':
        data[field.id] = false
        break
      default:
        data[field.id] = null
    }
  })
  formData.value = data
}, { immediate: true })

function buildRules (field) {
  const rules = []
  const v = field.validation
  const msgs = field.errorMessages

  if (v.required) {
    rules.push(val => (val !== null && val !== undefined && val !== '') || msgs.required)
  }

  if (v.minLength) {
    rules.push(val => !val || val.length >= v.minLength || msgs.minLength.replace('{n}', v.minLength))
  }

  if (v.maxLength) {
    rules.push(val => !val || val.length <= v.maxLength || msgs.maxLength.replace('{n}', v.maxLength))
  }

  if (v.min != null) {
    rules.push(val => val == null || val === '' || Number(val) >= v.min || msgs.min.replace('{n}', v.min))
  }

  if (v.max != null) {
    rules.push(val => val == null || val === '' || Number(val) <= v.max || msgs.max.replace('{n}', v.max))
  }

  if (v.pattern) {
    try {
      const regex = new RegExp(v.pattern)
      rules.push(val => !val || regex.test(val) || msgs.pattern)
    } catch {
      // Invalid regex, skip
    }
  }

  return rules
}
</script>
