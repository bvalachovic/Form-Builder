<template>
  <div class="element-palette q-pa-sm">
    <div class="text-subtitle1 text-weight-bold q-mb-sm q-px-sm">
      Form Elements
    </div>
    <q-separator class="q-mb-sm" />

    <draggable
      :list="paletteItems"
      :group="{ name: 'form-elements', pull: 'clone', put: false }"
      :clone="cloneElement"
      :sort="false"
      item-key="type"
    >
      <template #item="{ element }">
        <q-item class="palette-item" dense>
          <q-item-section avatar>
            <q-icon :name="element.icon" color="primary" size="sm" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ element.label }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              flat
              dense
              round
              size="sm"
              icon="add"
              color="primary"
              @click="$emit('add-field', element.type)"
            >
              <q-tooltip>Click to add</q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import { ELEMENT_TYPES, createField } from 'src/constants/elementTypes'

defineEmits(['add-field'])

// Local copy so draggable doesn't mutate our constant
const paletteItems = ref([...ELEMENT_TYPES])

function cloneElement (paletteItem) {
  return createField(paletteItem.type)
}
</script>

<style lang="scss" scoped>
.element-palette {
  background: #fafafa;
  border-right: 1px solid #e0e0e0;
  height: 100%;
  overflow-y: auto;
}
</style>
