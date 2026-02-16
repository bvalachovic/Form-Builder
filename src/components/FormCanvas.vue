<template>
  <div class="form-canvas">
    <draggable
      :list="fields"
      group="form-elements"
      item-key="id"
      class="canvas-area"
      :class="{ 'empty-canvas': fields.length === 0 }"
      ghost-class="sortable-ghost"
      animation="200"
    >
      <template #item="{ element, index }">
        <FormElement
          :field="element"
          @update:field="(updated) => updateField(index, updated)"
          @delete="removeField(index)"
          @duplicate="duplicateField(index)"
          @open-validation="$emit('open-validation', element.id)"
        />
      </template>
    </draggable>

    <div v-if="fields.length === 0" class="empty-state">
      <q-icon name="drag_indicator" size="48px" color="grey-4" />
      <div class="text-h6 text-grey-5 q-mt-sm">Drag elements here</div>
      <div class="text-body2 text-grey-4">
        or click the + button on an element to add it
      </div>
    </div>
  </div>
</template>

<script setup>
import draggable from 'vuedraggable'
import { createField } from 'src/constants/elementTypes'
import FormElement from './FormElement.vue'

const props = defineProps({
  fields: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['open-validation'])

function updateField (index, updatedField) {
  props.fields.splice(index, 1, updatedField)
}

function removeField (index) {
  props.fields.splice(index, 1)
}

function duplicateField (index) {
  const original = props.fields[index]
  const clone = JSON.parse(JSON.stringify(original))
  clone.id = crypto.randomUUID()
  clone.label = `${clone.label} (copy)`
  props.fields.splice(index + 1, 0, clone)
}
</script>

<style lang="scss" scoped>
.form-canvas {
  position: relative;
}

.empty-state {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
</style>
