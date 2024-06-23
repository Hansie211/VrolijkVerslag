<template>
  <q-page padding style="display: flex; align-items: center; flex-direction: column; width: 100%; position: relative; padding-left: 50px; padding-right: 50px">
    <div id="page-title-header" style="display: flex; align-items: center; flex-direction: column; width: 100%; position: relative">
      <div class="text-h3 q-mb-md">
        Week {{ DateUtils.getWeekNumber(report.startDate) }} - {{ report.theme }}
        <q-popup-edit v-model="report.theme" buttons v-slot="scope">
          <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
        </q-popup-edit>
      </div>

      <q-tabs v-model="currentDay" dense active-color="primary" indicator-color="primary" narrow-indicator>
        <q-tab v-for="(day, dayIndex) in Object.values(report.dayReports)" :key="dayIndex" :name="dayIndex" :label="DateUtils.getWeekDay(dayIndex)" />
      </q-tabs>

      <q-btn icon="print" @click="doExport" style="position: absolute; right: 10px" size="xl" />
    </div>

    <q-tab-panels v-model="currentDay" animated style="width: 100%; min-width: 1000px; height: 100%; display: flex; flex-direction: column">
      <template v-for="(day, dayIndex) in Object.values(report.dayReports)" :key="dayIndex">
        <q-tab-panel :name="dayIndex" style="width: 100%; height: 100%; display: flex; flex-direction: column">
          <form autocorrect="on" autocapitalize="on" autocomplete="off" spellcheck="true" style="height: 100%">
            <q-input v-model="day.description" type="textarea" debounce="300" style="height: 100%; font-size: 14pt; font-family: Tahoma, sans-serif; line-height: 1.2" input-style="height: 100%" outlined />
          </form>

          <div
            id="image-row"
            class="q-my-md q-px-none q-gutter-x-sm"
            style="height: 220px; display: flex; flex-wrap: nowrap; white-space: nowrap; overflow-x: auto; align-items: center; gap: 5px; flex-grow: 0; flex-shrink: 0"
          >
            <div style="width: 200px; height: 200px; border: 1px solid lightgray; display: inline-block; flex-grow: 0; flex-shrink: 0; display: flex; justify-content: center; align-items: center">
              <input type="file" multiple @change="handleFileUpload(dayIndex, $event)" style="display: none" :id="`fileInput${dayIndex}`" accept="image/*" />
              <q-btn size="xl" icon="photo_camera" @click="openFileInput(dayIndex)" :disable="day.images.length >= 10" />
            </div>

            <template v-for="(image, imgIndex) in day.images" :key="image">
              <div style="width: 200px; height: 200px; flex-grow: 0; flex-shrink: 0; border: 1px solid lightgray; display: inline-block; position: relative; box-sizing: border-box" class="q-pa-sm">
                <q-btn icon="delete" size="sm" style="position: absolute; top: 3px; right: 3px" flat round @click="removeImage(day, imgIndex)" />
                <img :src="image" style="width: 100%; height: 100%; object-fit: contain" />
              </div>
            </template>
          </div>
        </q-tab-panel>
      </template>
    </q-tab-panels>
  </q-page>
</template>

<script lang="ts">
import WeekReport, { DayReport } from 'src/data/models/WeekReport';
import { useWeekReportStore } from 'src/stores/weekReport';
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { saveAs } from 'file-saver';
import { getProperty } from 'src/data/ApplicationProperties';
import ImageUtils from 'src/libs/files/ImageUtils';
import FileUtils from 'src/libs/files/FileUtils';
import HTMLTemplate from 'src/libs/HtmlTemplate';
import ImageDialog from 'src/dialogs/ImageDialog.vue';
import DialogUtils from 'src/libs/DialogUtils';
import DateUtils from 'src/libs/DateUtils';

function paragraphs(text: string): string[] {
  return text
    .trim()
    .replace(/\n\s*\n/g, '\n')
    .split('\n');
}

function generateTemplates(report: WeekReport) {
  const templateValues: { [key: string]: string | number | Array<string> } = {
    theme: report.theme,
    weekNumber: DateUtils.getWeekNumber(report.startDate),
  };

  for (let i = 0; i < 5; i++) {
    templateValues['text_day_' + i] = paragraphs(report.dayReports[i].description).map((txt) => `<p>${txt}</p>`);
    templateValues['img_day_' + i] = report.dayReports[i].images.map((img) => `<img src="${img}" />`);
  }

  return templateValues;
}

export default defineComponent({
  name: 'VerslagPage',

  setup() {
    const route = useRoute();
    const weekReportStore = useWeekReportStore();

    const reportId = route.query['reportId'] as string;
    const report = weekReportStore.get(reportId) as WeekReport | undefined;
    if (report === undefined) {
      throw new Error('Report is not found');
    }

    return {
      weekReportStore,
      report,
      currentDay: ref(0),
      DateUtils,
    };
  },

  computed: {
    maxImagesPerDay(): number {
      return getProperty('maxImagesPerDay', 10);
    },
  },

  methods: {
    async openFileInput(dayIndex: number) {
      const r = await DialogUtils.showDialog({ component: ImageDialog, componentProps: { report: this.report, dayIndex } });
      console.log(r);

      // const fileInput = document.querySelector<HTMLInputElement>(`#fileInput${index}`);
      // if (fileInput) {
      //   fileInput.click();
      // }
    },

    removeImage(day: DayReport, index: number) {
      day.images.splice(index, 1);
    },

    async doExport() {
      const templateValues = generateTemplates(this.report);
      const html = HTMLTemplate.createTemplate('report', templateValues);

      const blob = new Blob([html], { type: 'text/html' });
      saveAs(blob, `Verslag week ${DateUtils.getWeekNumber(this.report.startDate)}.html`);
    },

    async handleFileUpload(index: number, event: Event & { target: HTMLInputElement }) {
      const files: FileList | null = event.target.files;

      // Clear the input
      event.target.type = 'text';
      event.target.type = 'file';

      if (!files) {
        return;
      }

      const day = this.report.dayReports[index];

      for (let i = 0; i < files.length && day.images.length < this.maxImagesPerDay; i++) {
        try {
          const fileData = await ImageUtils.resizeImage(files[i], 1280, 720);
          if (fileData === null) {
            console.warn('Cannot resize image');
          }

          const datauri = await FileUtils.getDataURI(fileData);
          day.images.push(datauri);
        } catch (e) {
          console.warn('Cannot process', files[i], e);
        }
      }
    },
  },
});
</script>

<style>
.q-field__control {
  height: 100% !important;
}
</style>
src/libs/HtmlTemplate
