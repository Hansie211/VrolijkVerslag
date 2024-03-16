<template>
  <q-page padding style="display: flex; justify-content: center; width: 100%; background-color: lightgray; min-height: 100%">
    <div style="width: 210mm; min-height: 100%; box-sizing: border-box; background-color: white; position: relative">
      <iframe style="width: 100%; min-height: 100%; display: none"></iframe>
      <q-btn @click="doExport" />
      <!-- <div style="width: 100%; min-height: 100%; font-size: 8px" id="report-page">
        <h3 style="flex-shrink: 0; flex-grow: 0" @click="(e) => doExport()">
          {{ report.theme }}
        </h3>

        <div v-for="(day, dayIndex) in Object.values(report.dayReports)" :key="dayIndex" style="display: flex; flex-direction: column">
          <h4>{{ getWeekDay(dayIndex) }}</h4>
          <div style="font-size: 14pt; font-family: Tahoma, sans-serif">
            <p v-for="p in paragraphs(day.description)" :key="p">{{ p }}</p>
          </div>
          <div v-for="image in day.images" :key="image" style="page-break-before: always">
            <img :src="image" style="width: 100%; height: 100%; object-fit: contain" />
          </div>
        </div>
      </div> -->
    </div>
  </q-page>
</template>

<script lang="ts">
import { useWeekReportStore } from 'src/stores/weekReport';
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { getISOWeek } from 'date-fns';

export default defineComponent({
  name: 'ExportPage',

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
    };
  },

  async mounted() {
    let html = require('../assets/report-template.html').default as string;

    const vars: { [key: string]: string | number | Array<string> } = {
      theme: this.report.theme,
      weekNumber: getISOWeek(this.report.startDate),
      text_day_0: this.paragraphs(this.report.dayReports[0].description).map((txt) => `<p>${txt}</p>`),
      img_day_0: this.report.dayReports[0].images.map((img) => `<img src="${img}" />`).join(''),
      text_day_1: this.paragraphs(this.report.dayReports[1].description).map((txt) => `<p>${txt}</p>`),
      img_day_1: this.report.dayReports[1].images.map((img) => `<img src="${img}" />`).join(''),
    };

    Object.keys(vars).forEach((key) => {
      const value = vars[key];

      html = html.replaceAll(`%${key.toUpperCase()}%`, Array.isArray(value) ? value.join('') : value.toString());
    });

    //html = html.replace('%THEME%', this.report.theme);

    let iframe = document.querySelector('iframe');
    if (iframe == null) throw new Error();
    let doc = iframe.contentDocument;
    if (doc == null) throw new Error();
    doc.open();
    doc.write(html);
    doc.close();

    // iframe.addEventListener('load', function () {
    //   iframe?.contentWindow?.print();
    // });
  },

  methods: {
    getWeekDay(index: number) {
      const DAYS = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
      return DAYS[index];
    },

    paragraphs(text: string): string[] {
      return text.replace(/\n\s*\n/g, '\n').split('\n');
    },

    doExport() {
      const iframe = document.querySelector('iframe');
      iframe?.contentWindow?.print();
      // var source = window.document.getElementById('report-page');
      // if (source == null) {
      //   return;
      // }
      // console.log('TODPD');

      // const doc = new jsPDF();
      // doc.html(source as HTMLElement, {
      //   callback: function (doc) {
      //     doc.save();
      //   },
      //   x: 10,
      //   y: 10,
      // });
      //doc.autoPrint();
      //doc.output('dataurlnewwindow');

      //doc.save('verslag.pdf');

      // domToPdf(
      //   source,
      //   {
      //     margins: {
      //       top: 20, // Top margin in millimeters
      //       right: 20, // Right margin in millimeters
      //       bottom: 20, // Bottom margin in millimeters
      //       left: 20, // Left margin in millimeters
      //     },
      //     filename: 'test.pdf',
      //   },
      //   function (pdf: never) {
      //     console.log('done');
      //   }
      // );
    },
  },
});
</script>

<style>
@page {
  margin: 20mm;
}
</style>
