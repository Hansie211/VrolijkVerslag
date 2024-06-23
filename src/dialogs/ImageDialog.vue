<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 900px; height: 800px; display: flex; flex-direction: column; max-height: 100%">
      <q-card-section class="row" style="height: 100%; flex-wrap: nowrap; max-height: 100%; min-height: 0">
        <!-- Large image preview -->
        <div class="flex flex-center column q-px-sm" style="width: 100%; height: 100%; flex-shrink: 1; flex-wrap: nowrap">
          <q-img :src="currentImage?.image" style="max-width: 100%; height: 100%; margin-bottom: 10px" fit="contain" />
          <q-input
            ref="imageTextInput"
            v-model="currentImageText"
            type="textarea"
            debounce="300"
            style="height: 100px; width: 100%; flex-grow: 0; flex-shrink: 0; font-size: 14pt; font-family: Tahoma, sans-serif; line-height: 1.2"
            input-style="height: 100%; resize: none"
            outlined
            autofocus
            :disable="currentImage === undefined"
          />
        </div>

        <!-- Vertical scrollable list of images -->
        <div style="width: 240px; flex-grow: 0; flex-shrink: 0">
          <q-scroll-area style="height: 100%">
            <q-list>
              <template v-for="(image, imgIndex) in dayReport.images" :key="image">
                <q-item clickable @click="setCurrentImage(imgIndex)" :active="imgIndex === currentImageIndex">
                  <div style="width: 200px; height: 200px; flex-grow: 0; flex-shrink: 0; display: inline-block; position: relative" class="q-pa-sm">
                    <q-btn icon="delete" size="sm" style="position: absolute; top: 3px; right: 3px" color="white" text-color="black" round @click="removeImage(imgIndex)" />
                    <img :src="image.image" style="width: 100%; height: 100%; object-fit: cover" />
                  </div>
                </q-item>
              </template>
            </q-list>
          </q-scroll-area>
        </div>
      </q-card-section>

      <q-card-actions class="q-px-md" style="height: 100px; flex-grow: 0; flex-shrink: 0; display: flex; flex-direction: row; align-items: center">
        <q-btn icon="add" size="md" padding="md" label="toevoegen" color="primary" @click="uploadImage()" />
        <input type="file" ref="fileInput" multiple @change="handleFileUpload($event)" style="display: none" accept="image/*" />
        <q-space />
        <q-btn icon-right="close" size="md" padding="md" label="Sluiten" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { getProperty } from 'src/data/ApplicationProperties';
import WeekReport, { DayImage } from 'src/data/models/WeekReport';
import FileUtils from 'src/libs/files/FileUtils';
import ImageUtils from 'src/libs/files/ImageUtils';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    dayIndex: {
      type: Number,
      required: true,
    },
    report: {},
  },

  emits: [...useDialogPluginComponent.emits],

  setup(props) {
    const dayReport = (props.report as WeekReport).dayReports[props.dayIndex];
    const currentImageIndex = ref(0);

    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
    return {
      dialogRef,
      onDialogHide,
      onOKClick() {
        onDialogOK({ num: 1, v: 'HALLO' });
      },
      onCancelClick: onDialogCancel,

      currentImageIndex,
      dayReport,
      emptyText: ref(''),
    };
  },

  methods: {
    setCurrentImage(index: number) {
      this.currentImageIndex = index;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.$refs as any)['imageTextInput'].focus();
    },

    uploadImage() {
      if (this.dayReport.images.length >= this.maxImagesPerDay) {
        this.$q.dialog({
          title: 'Limiet bereikt',
          message: `Het maximaal aantal afbeeldingen (${this.maxImagesPerDay}) is voor deze dag bereikt.`,
        });
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.$refs as any)['fileInput'].click();
    },

    removeImage(index: number) {
      this.dayReport.images.splice(index, 1);
      if (index === this.currentImageIndex) {
        this.currentImageIndex = 0;
      }
    },

    async handleFileUpload(event: Event & { target: HTMLInputElement }) {
      const files: FileList | null = event.target.files;

      // Clear the input
      event.target.type = 'text';
      event.target.type = 'file';

      if (!files) {
        return;
      }

      for (let i = 0; i < files.length && this.dayReport.images.length < this.maxImagesPerDay; i++) {
        try {
          const fileData = await ImageUtils.resizeImage(files[i], this.maxImageWidth, this.maxImageHeight);
          if (fileData === null) {
            console.warn('Cannot resize image');
          }

          const dataUri = await FileUtils.getDataURI(fileData);
          this.dayReport.images.push({ image: dataUri, text: '' });
        } catch (e) {
          console.warn('Cannot process', files[i], e);
        }
      }
    },
  },

  computed: {
    currentImage(): DayImage | undefined {
      return this.dayReport.images[this.currentImageIndex];
    },
    maxImagesPerDay(): number {
      return getProperty('maxImagesPerDay', 10);
    },
    maxImageWidth(): number {
      return getProperty('maxImageWidth', 1280);
    },
    maxImageHeight(): number {
      return getProperty('maxImageHeight', 1280);
    },

    currentImageText: {
      get() {
        return this.currentImage?.text || '';
      },
      set(value: string) {
        if (this.currentImage) {
          this.currentImage.text = value;
        }
      },
    },
  },
});
</script>
