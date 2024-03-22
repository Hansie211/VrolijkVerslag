<template>
  <q-page padding style="display: flex; justify-content: center; width: 100%">
    <div style="width: 80%; min-width: 1000px; height: 100%; display: flex; flex-direction: column">
      <div class="flex row q-pa-sm q-gutter-x-md">
        <q-btn to="/" icon="home" rounded />
        <div class="text-h3" style="flex-shrink: 0; flex-grow: 0">
          <span style="font-size: 0.6em">Week {{ getISOWeek(report.startDate) }}</span> - {{ report.theme }} - <span style="font-size: 0.6em">{{ getWeekDay(currentDay) }}</span>
          <q-popup-edit v-model="report.theme" buttons v-slot="scope">
            <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
          </q-popup-edit>
        </div>
        <q-space />
        <q-btn icon="print" @click="doExport" />
      </div>

      <q-carousel v-model="currentDay" transition-prev="slide-right" transition-next="slide-left" control-color="primary" class="rounded-borders" arrows style="width: 100%; height: 100%" padding>
        <q-carousel-slide v-for="(day, dayIndex) in Object.values(report.dayReports)" :key="dayIndex" :name="dayIndex" style="width: 100%; height: 100%; display: flex; flex-direction: column">
          <form autocorrect="on" autocapitalize="on" autocomplete="off" spellcheck="true" style="height: 100%">
            <q-input v-model="day.description" type="textarea" debounce="300" style="height: 100%; font-size: 14pt; font-family: Tahoma, sans-serif; line-height: 1.2" input-style="height: 100%" outlined />
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
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import getEnvironmentProperties from 'src/data/EnvironmentProperties';
import getApplicationProperties, { getProperty } from 'src/data/ApplicationProperties';

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
      currentDay: ref(0),
      getISOWeek,
    };
  },

  computed: {
    maxImagesPerDay(): number {
      return getProperty('maxImagesPerDay', 10);
    },
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

    async doExport() {
      const vars: { [key: string]: string | number | Array<string> } = {
        theme: this.report.theme,
        weekNumber: getISOWeek(this.report.startDate),
      };

      for (let i = 0; i < 5; i++) {
        vars['text_day_' + i] = this.paragraphs(this.report.dayReports[i].description).map((txt) => `<p>${txt}</p>`);
        vars['img_day_' + i] = this.report.dayReports[i].images.map((img) => `<img src="${img}" />`);
      }

      let html = require('src/assets/document/report-template.html').default as string;
      Object.keys(vars).forEach((key) => {
        const value = vars[key];
        html = html.replaceAll(`%${key.toUpperCase()}%`, Array.isArray(value) ? value.join('') : value.toString());
      });

      const zip = new JSZip();

      const files: { [key: string]: string } = {
        '_rels/.rels': require('src/assets/document/word/_rels/.rels').default as string,
        'docProps/app.xml': require('src/assets/document/word/docProps/app.xml').default as string,
        'docProps/core.xml': require('src/assets/document/word/docProps/core.xml').default as string,
        'word/_rels/document.xml.rels': require('src/assets/document/word/word/_rels/document.xml.rels').default as string,
        'word/theme/theme1.xml': require('src/assets/document/word/word/theme/theme1.xml').default as string,
        'word/document.xml': require('src/assets/document/word/word/document.xml').default as string,
        'word/fontTable.xml': require('src/assets/document/word/word/fontTable.xml').default as string,
        'word/settings.xml': require('src/assets/document/word/word/settings.xml').default as string,
        'word/styles.xml': require('src/assets/document/word/word/styles.xml').default as string,
        'word/webSettings.xml': require('src/assets/document/word/word/webSettings.xml').default as string,
        '[Content_Types].xml': require('src/assets/document/word/[Content_Types].xml').default as string,
      };

      const addB64 = (name: string, uri: string) => {
        const idx = uri.indexOf('base64,') + 'base64,'.length;
        const content = uri.substring(idx);
        zip.file(name, content, { base64: true });
      };

      Object.keys(files).forEach((fname) => {
        const content = files[fname];
        zip.file(fname, content);
      });

      addB64('word/media/image1.jpeg', this.report.dayReports[0].images[0]);
      addB64('word/media/image2.jpeg', this.report.dayReports[0].images[1]);

      zip.generateAsync({ type: 'blob', compression: 'STORE' }).then(function (content) {
        // see FileSaver.js
        saveAs(content, 'word.docx');
      });

      // html = `To: Example\nSubject: Verslag week ${getISOWeek(this.report.startDate)} - ${this.report.theme}\nX-Unsent: 1\nContent-Type: text/html\n\n` + html;

      // var bl = new Blob([html], { type: 'text/plain' });
      // var a = document.createElement('a');
      // a.href = URL.createObjectURL(bl);
      // a.download = `Verslag week ${getISOWeek(this.report.startDate)} - ${this.report.theme}.eml`;
      // a.hidden = true;
      // // a.target = '_blank';
      // document.body.appendChild(a);
      // a.click();
    },

    paragraphs(text: string): string[] {
      return text
        .trim()
        .replace(/\n\s*\n/g, '\n')
        .split('\n');
    },

    async handleFileUpload(index: number, event: Event & { target: HTMLInputElement & EventTarget }) {
      const files: FileList | null = event.target.files;

      // Clear the input
      event.target.type = 'text';
      event.target.type = 'file';

      if (!files) {
        return;
      }

      const day = this.report.dayReports[index];

      for (let i = 0; i < files.length && day.images.length < this.maxImagesPerDay; i++) {
        const fileData = await resizeImage(files[i], 1280, 720);
        if (fileData === null) {
          console.log('Failed', i);
        }

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
        reject(null);
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
