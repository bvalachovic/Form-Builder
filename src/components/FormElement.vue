<template>
  <q-card flat bordered class="form-element-card q-mb-sm">
    <q-card-section class="q-pa-sm">
      <!-- Header: icon, label, kebab menu -->
      <div class="row items-center no-wrap">
        <q-icon
          :name="elementIcon"
          color="primary"
          size="xs"
          class="q-mr-sm cursor-move"
        />
        <q-input
          v-model="localField.label"
          borderless
          dense
          input-class="text-weight-medium"
          class="col"
          @update:model-value="emitUpdate"
        />
        <q-chip
          v-if="localField.validation.required"
          dense
          color="orange-2"
          text-color="orange-9"
          size="sm"
          class="q-mr-xs"
        >
          Required
        </q-chip>
        <q-btn flat dense round icon="more_vert" size="sm">
          <q-menu>
            <q-list dense style="min-width: 180px">
              <q-item clickable v-close-popup @click="$emit('open-validation')">
                <q-item-section avatar>
                  <q-icon name="rule" size="xs" />
                </q-item-section>
                <q-item-section>Configure Validation</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$emit('duplicate')">
                <q-item-section avatar>
                  <q-icon name="content_copy" size="xs" />
                </q-item-section>
                <q-item-section>Duplicate</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="$emit('delete')">
                <q-item-section avatar>
                  <q-icon name="delete" size="xs" color="negative" />
                </q-item-section>
                <q-item-section class="text-negative">Delete</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>

      <!-- Field preview -->
      <div class="q-mt-xs q-pl-lg">
        <!-- Text / Email / Number -->
        <q-input
          v-if="['text', 'email', 'number'].includes(localField.type)"
          :type="localField.type === 'number' ? 'number' : 'text'"
          :placeholder="localField.placeholder || `Enter ${localField.label.toLowerCase()}`"
          outlined
          dense
          disable
        />

        <!-- Textarea -->
        <q-input
          v-else-if="localField.type === 'textarea'"
          type="textarea"
          :placeholder="localField.placeholder || `Enter ${localField.label.toLowerCase()}`"
          outlined
          dense
          disable
          rows="2"
        />

        <!-- Date Picker -->
        <q-input
          v-else-if="localField.type === 'date'"
          placeholder="YYYY-MM-DD"
          outlined
          dense
          disable
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer" />
          </template>
        </q-input>

        <!-- Select -->
        <q-select
          v-else-if="localField.type === 'select'"
          :options="localField.options.map(o => o.label)"
          outlined
          dense
          disable
          placeholder="Select an option"
        />

        <!-- Radio Group -->
        <q-option-group
          v-else-if="localField.type === 'radio'"
          :options="localField.options"
          type="radio"
          disable
        />

        <!-- Checkbox Group -->
        <q-option-group
          v-else-if="localField.type === 'checkbox'"
          :options="localField.options"
          type="checkbox"
          disable
          :model-value="[]"
        />

        <!-- Toggle -->
        <q-toggle
          v-else-if="localField.type === 'toggle'"
          :label="localField.placeholder || 'Toggle'"
          disable
        />

        <!-- Options Editor (for select, radio, checkbox) -->
        <OptionsEditor
          v-if="hasOptions"
          :options="localField.options"
          @update:options="onOptionsUpdate"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ELEMENT_TYPES, OPTION_TYPES } from 'src/constants/elementTypes'
import OptionsEditor from './OptionsEditor.vue'

const props = defineProps({
  field: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:field', 'delete', 'open-validation', 'duplicate'])

const localField = ref(JSON.parse(JSON.stringify(props.field)))

// Sync when parent pushes changes (e.g., after validation dialog save)
watch(() => props.field, (val) => {
  localField.value = JSON.parse(JSON.stringify(val))
}, { deep: true })

const elementIcon = computed(() => {
  const def = ELEMENT_TYPES.find(e => e.type === localField.value.type)
  return def ? def.icon : 'help_outline'
})

const hasOptions = computed(() => OPTION_TYPES.includes(localField.value.type))

function emitUpdate () {
  emit('update:field', JSON.parse(JSON.stringify(localField.value)))
}

function onOptionsUpdate (newOptions) {
  localField.value.options = newOptions
  emitUpdate()
}
</script>

<style lang="scss" scoped>
.form-element-card {
  cursor: default;

  .cursor-move {
    cursor: grab;
  }
}
</style>
