<template>
  <q-page class="q-pa-lg">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <div class="text-h4 text-weight-bold">My Forms</div>
        <div class="text-body2 text-grey">
          {{ forms.length ? `${forms.length} form${forms.length > 1 ? 's' : ''} created` : 'No forms yet' }}
        </div>
      </div>
      <q-btn
        unelevated
        color="primary"
        icon="add"
        label="Build a Form"
        no-caps
        size="md"
        @click="$router.push({ name: 'builder' })"
      />
    </div>

    <!-- Empty State -->
    <div v-if="forms.length === 0" class="empty-state q-mt-xl">
      <q-icon name="dynamic_form" size="80px" color="grey-4" />
      <div class="text-h5 text-grey-5 q-mt-md">No forms yet</div>
      <div class="text-body1 text-grey-4 q-mb-lg">
        Click "Build a Form" to create your first form
      </div>
      <q-btn
        unelevated
        flat
        color="primary"
        icon="add"
        label="Build a Form"
        no-caps
        size="lg"
        @click="$router.push({ name: 'builder' })"
      />
    </div>

    <!-- Form Cards Grid -->
    <div v-else class="row q-gutter-md">
      <div
        v-for="form in forms"
        :key="form.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card class="form-card full-height">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6 ellipsis">{{ form.name }}</div>
              </div>
              <q-btn flat dense round icon="more_vert" size="sm">
                <q-menu>
                  <q-list dense style="min-width: 150px">
                    <q-item
                      clickable
                      v-close-popup
                      @click="$router.push({ name: 'builder', params: { id: form.id } })"
                    >
                      <q-item-section avatar>
                        <q-icon name="edit" size="xs" />
                      </q-item-section>
                      <q-item-section>Edit</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="previewForm(form)">
                      <q-item-section avatar>
                        <q-icon name="visibility" size="xs" />
                      </q-item-section>
                      <q-item-section>Preview</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup @click="confirmDelete(form)">
                      <q-item-section avatar>
                        <q-icon name="delete" size="xs" color="negative" />
                      </q-item-section>
                      <q-item-section class="text-negative">Delete</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="row items-center q-gutter-x-sm q-mb-sm">
              <q-icon name="view_list" size="xs" color="grey" />
              <span class="text-body2 text-grey">
                {{ form.fields.length }} field{{ form.fields.length !== 1 ? 's' : '' }}
              </span>
            </div>

            <!-- Field type chips -->
            <div class="q-gutter-xs">
              <q-chip
                v-for="fieldType in getUniqueFieldTypes(form)"
                :key="fieldType.type"
                dense
                size="sm"
                :icon="fieldType.icon"
                color="grey-3"
                text-color="grey-8"
              >
                {{ fieldType.count }}
              </q-chip>
            </div>
          </q-card-section>

          <q-space />

          <q-separator />

          <q-card-section class="q-pa-sm">
            <div class="row items-center text-caption text-grey">
              <q-icon name="schedule" size="xs" class="q-mr-xs" />
              Updated {{ formatDate(form.updatedAt) }}
            </div>
          </q-card-section>

          <q-card-actions>
            <q-btn
              flat
              no-caps
              color="primary"
              label="Edit"
              icon="edit"
              class="col"
              @click="$router.push({ name: 'builder', params: { id: form.id } })"
            />
            <q-btn
              flat
              no-caps
              color="grey"
              label="Preview"
              icon="visibility"
              class="col"
              @click="previewForm(form)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Preview Dialog -->
    <q-dialog v-model="showPreview" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card>
        <q-bar class="bg-primary text-white">
          <div class="text-weight-bold">Preview: {{ previewFormData?.name }}</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-pa-lg" style="max-width: 700px; margin: 0 auto">
          <FormRenderer v-if="previewFormData" :form="previewFormData" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useFormStore } from 'src/stores/formStore'
import { ELEMENT_TYPES } from 'src/constants/elementTypes'
import FormRenderer from 'src/components/FormRenderer.vue'

const $q = useQuasar()
const formStore = useFormStore()

const forms = computed(() => formStore.forms)

const showPreview = ref(false)
const previewFormData = ref(null)

function getUniqueFieldTypes (form) {
  const counts = {}
  form.fields.forEach(f => {
    counts[f.type] = (counts[f.type] || 0) + 1
  })
  return Object.entries(counts).map(([type, count]) => {
    const def = ELEMENT_TYPES.find(e => e.type === type)
    return {
      type,
      icon: def ? def.icon : 'help',
      count
    }
  })
}

function formatDate (isoString) {
  if (!isoString) return 'N/A'
  const d = new Date(isoString)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function previewForm (form) {
  previewFormData.value = form
  showPreview.value = true
}

function confirmDelete (form) {
  $q.dialog({
    title: 'Delete Form',
    message: `Are you sure you want to delete "${form.name}"? This cannot be undone.`,
    cancel: true,
    persistent: true,
    ok: {
      label: 'Delete',
      color: 'negative',
      flat: true
    }
  }).onOk(() => {
    formStore.deleteForm(form.id)
    $q.notify({ type: 'positive', message: 'Form deleted.' })
  })
}
</script>

<style lang="scss" scoped>
.form-card {
  transition: box-shadow 0.2s;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
}
</style>
