<template>
  <q-page padding style="display: flex; justify-content: center; width: 100%">
    <div style="width: 80%; min-width: 1000px; height: 100%; display: flex; flex-direction: column">
      <div class="flex row q-pa-sm q-gutter-x-md">
        <q-btn to="/" icon="home" rounded />
        <div class="text-h3" style="flex-shrink: 0; flex-grow: 0">
          <span style="font-size: 0.6em">Week {{ getISOWeek(report.startDate) }}</span> - {{ report.theme }} - <span style="font-size: 0.6em">{{ getWeekDay(slide) }}</span>
          <q-popup-edit v-model="report.theme" buttons v-slot="scope">
            <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
          </q-popup-edit>
        </div>
        <q-space />
        <q-btn icon="print" :to="{ name: 'ExportPage', query: { reportId: report.id } }" />
      </div>

      <q-carousel v-model="slide" transition-prev="slide-right" transition-next="slide-left" control-color="primary" class="rounded-borders" arrows style="width: 100%; height: 100%">
        <q-carousel-slide v-for="(day, dayIndex) in Object.values(report.dayReports)" :key="dayIndex" :name="dayIndex" style="width: 100%; height: 100%; display: flex; flex-direction: column">
          <form autocorrect="on" autocapitalize="on" autocomplete="off" spellcheck="true" style="height: 100%">
            <q-input v-model="day.description" type="textarea" debounce="300" style="height: 100%; font-size: 14pt; font-family: Tahoma, sans-serif; line-height: 1.2" class="q-mx-xl" input-style="height: 100%" outlined />
          </form>

          <div class="q-my-md q-px-md q-gutter-x-sm" style="height: 200px; display: flex; flex-wrap: nowrap; white-space: nowrap; overflow-x: auto; align-items: center; gap: 5px; flex-grow: 0; flex-shrink: 0">
            <div style="width: 200px; height: 200px; border: 1px solid lightgray; display: inline-block; flex-grow: 0; flex-shrink: 0; display: flex; justify-content: center; align-items: center">
              <input type="file" multiple @change="handleFileUpload(dayIndex, $event)" style="display: none" :id="`fileInput${dayIndex}`" accept="image/*" />
              <q-btn label="Afbeelding toevoegen" size="sm" icon="add" @click="openFileInput(dayIndex)" :disable="day.images.length >= 10" />
            </div>

            <div v-for="(image, imgIndex) in day.images" :key="image" style="width: 200px; height: 200px; flex-grow: 0; flex-shrink: 0; border: 1px solid lightgray; display: inline-block; position: relative; box-sizing: border-box" class="q-pa-sm">
              <q-btn icon="delete" size="sm" style="position: absolute; top: 3px; right: 3px" flat round @click="removeImage(day, imgIndex)" />
              <img :src="image" style="width: 100%; height: 100%; object-fit: contain" />
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </q-page>
</template>

<script lang="ts">
import { DayReport } from 'src/data/models/WeekReport';
import { useWeekReportStore } from 'src/stores/weekReport';
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getISOWeek } from 'date-fns';

export default defineComponent({
  name: 'VerslagPage',

  setup() {
    const route = useRoute();
    const weekReportStore = useWeekReportStore();

    const reportId = route.query['reportId'] as string;
    const report = weekReportStore.get(reportId);
    if (report === undefined) {
      throw new Error('Report is not found');
    }

    return {
      weekReportStore,
      report,
      slide: ref(0),
      getISOWeek,
    };
  },

  methods: {
    getWeekDay(index: number) {
      const DAYS = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
      return DAYS[index];
    },

    openFileInput(index: number) {
      const fileInput = document.querySelector<HTMLInputElement>(`#fileInput${index}`);
      if (fileInput) {
        fileInput.click();
      }
    },

    removeImage(day: DayReport, index: number) {
      day.images.splice(index, 1);
    },

    onPaste(evt: ClipboardEvent, dayIndex: number) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const editorRef = (this.$refs as unknown as any)[`editorRef_${dayIndex}`][0];

      if ((evt.target as HTMLElement)?.nodeName === 'INPUT') return;
      let text: string | undefined, onPasteStripFormattingIEPaste: boolean | undefined;

      evt.preventDefault();
      evt.stopPropagation();

      if (evt.clipboardData?.getData) {
        text = evt.clipboardData.getData('text/plain');
        if (editorRef && editorRef.runCmd) {
          editorRef.runCmd('insertText', text);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } else if ('clipboardData' in window && (window as any).clipboardData.getData) {
        if (!onPasteStripFormattingIEPaste) {
          onPasteStripFormattingIEPaste = true;
          if (editorRef && editorRef.runCmd) {
            editorRef.runCmd('ms-pasteTextOnly', text);
          }
        }
        onPasteStripFormattingIEPaste = false;
      }
    },

    async handleFileUpload(index: number, event: Event & { target: HTMLInputElement & EventTarget }) {
      const files: FileList | null = event.target.files;

      event.target.type = 'text';
      event.target.type = 'file';

      if (!files) {
        console.log('no files');
        return;
      }

      const day = this.report.dayReports[index];

      console.log('update', files);

      for (let i = 0; i < files.length && day.images.length < 10; i++) {
        const fileData = await resizeImage(files[i], 1280, 720);
        if (fileData === null) {
          console.log('Failed', i);
        }

        console.log(day.images.length, day.images.length < 10);

        day.images.push(await readFile(fileData as Blob));
      }
    },
  },
});

function readFile(file: Blob): Promise<string> {
  return new Promise((resolv) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolv(reader.result as string);
    };

    reader.readAsDataURL(file);
  });
}

function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob | null> {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      let width = image.width;
      let height = image.height;

      if (width <= maxWidth && height <= maxHeight) {
        resolve(file);
        return;
      }

      let newWidth;
      let newHeight;

      if (width > height) {
        newHeight = height * (maxWidth / width);
        newWidth = maxWidth;
      } else {
        newWidth = width * (maxHeight / height);
        newHeight = maxHeight;
      }

      let canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;

      let context = canvas.getContext('2d');
      if (context === null) {
        resolve(null);
        return;
      }

      context.drawImage(image, 0, 0, newWidth, newHeight);

      canvas.toBlob(resolve, file.type);
    };
    image.onerror = reject;
  });
}
</script>

<style>
.q-field__control {
  height: 100% !important;
}
</style>
