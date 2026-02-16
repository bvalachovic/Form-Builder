<template>
  <div class="q-mt-sm">
    <div class="text-caption text-grey-7 q-mb-xs">Options</div>

    <div
      v-for="(opt, idx) in localOptions"
      :key="idx"
      class="row items-center q-gutter-x-sm q-mb-xs"
    >
      <q-input
        v-model="opt.label"
        dense
        outlined
        label="Label"
        class="col"
        @update:model-value="emitUpdate"
      />
      <q-input
        v-model="opt.value"
        dense
        outlined
        label="Value"
        class="col"
        @update:model-value="emitUpdate"
      />
      <q-btn
        flat
        dense
        round
        icon="close"
        color="negative"
        size="sm"
        :disable="localOptions.length <= 1"
        @click="removeOption(idx)"
      >
        <q-tooltip>Remove option</q-tooltip>
      </q-btn>
    </div>

    <q-btn
      flat
      dense
      no-caps
      icon="add"
      label="Add Option"
      color="primary"
      size="sm"
      class="q-mt-xs"
      @click="addOption"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:options'])

const localOptions = ref(JSON.parse(JSON.stringify(props.options)))

watch(() => props.options, (val) => {
  localOptions.value = JSON.parse(JSON.stringify(val))
}, { deep: true })

function emitUpdate () {
  emit('update:options', JSON.parse(JSON.stringify(localOptions.value)))
}

function addOption () {
  const num = localOptions.value.length + 1
  localOptions.value.push({ label: `Option ${num}`, value: `option_${num}` })
  emitUpdate()
}

function removeOption (idx) {
  localOptions.value.splice(idx, 1)
  emitUpdate()
}
</script>
