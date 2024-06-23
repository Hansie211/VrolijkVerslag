<template>
  <q-page padding style="display: flex; align-items: center; flex-direction: column; width: 100%; position: relative; padding-left: 50px; padding-right: 50px">
    <div id="page-title-header" style="display: flex; align-items: center; flex-direction: column; width: 100%">
      <div class="text-h3 q-mb-md">
        Week {{ DateUtils.getWeekNumber(report.startDate) }} - {{ report.theme }}
        <q-popup-edit v-model="report.theme" buttons v-slot="scope">
          <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
        </q-popup-edit>
      </div>

      <q-tabs v-model="currentDay" dense active-color="primary" indicator-color="primary" narrow-indicator>
        <q-tab v-for="(day, dayIndex) in Object.values(report.dayReports)" :key="dayIndex" :name="dayIndex" :label="DateUtils.getWeekDay(dayIndex)" />
      </q-tabs>
    </div>

    <q-tab-panels v-model="currentDay" animated style="width: 100%; min-width: 1000px; height: 100%; display: flex; flex-direction: column">
      <template v-for="(day, dayIndex) in Object.values(report.dayReports)" :key="dayIndex">
        <q-tab-panel :name="dayIndex" style="width: 100%; height: 100%; display: flex; flex-direction: column">
          <form autocorrect="on" autocapitalize="on" autocomplete="off" spellcheck="true" style="height: 100%">
            <q-input
              v-model="day.description"
              type="textarea"
              debounce="300"
              style="height: 100%; font-size: 14pt; font-family: Tahoma, sans-serif; line-height: 1.2"
              input-style="height: 100%; resize: none"
              outlined
            />
          </form>

          <div id="image-row" class="q-my-md" style="height: 80px; display: flex; flex-grow: 0; flex-shrink: 0">
            <q-btn size="xl" icon="photo_camera" label="+" @click="openImageDialog(dayIndex)" />
            <q-space />
            <q-btn icon="email" @click="doExport" size="xl" />
          </div>
        </q-tab-panel>
      </template>
    </q-tab-panels>
  </q-page>
</template>

<script lang="ts">
import WeekReport from 'src/data/models/WeekReport';
import { useWeekReportStore } from 'src/stores/weekReport';
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { saveAs } from 'file-saver';
import { getProperty } from 'src/data/ApplicationProperties';
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
    templateValues['img_day_' + i] = report.dayReports[i].images.map(
      (img) => `
    <div class="img-wrapper">
    <img src="${img.image}" />
    <div>${img.text}</div>
    </div>
    `
    );
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
    async openImageDialog(dayIndex: number) {
      await DialogUtils.showDialog({ component: ImageDialog, componentProps: { report: this.report, dayIndex } });
    },

    async doExport() {
      const templateValues = generateTemplates(this.report);
      const html = HTMLTemplate.createTemplate('report', templateValues);

      const blob = new Blob([html], { type: 'text/html' });
      saveAs(blob, `Verslag week ${DateUtils.getWeekNumber(this.report.startDate)}.html`);
    },
  },
});
</script>

<style>
.q-field__control {
  height: 100% !important;
}
</style>
