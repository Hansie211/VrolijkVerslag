<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <h1>IMAGE {{ dayIndex }}</h1>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Sluiten" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    dayIndex: {
      type: Number,
      required: true,
    },
  },

  emits: [...useDialogPluginComponent.emits],

  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

    return {
      dialogRef,
      onDialogHide,

      onOKClick() {
        onDialogOK({ num: 1, v: 'HALLO' });
      },

      onCancelClick: onDialogCancel,
    };
  },
});
</script>
