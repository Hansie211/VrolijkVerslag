<template>
  <q-page padding style="display: flex; justify-content: center; width: 100%; background-color: lightgray">
    <div style="width: 210mm; min-height: 100%; box-sizing: border-box; background-color: white; position: relative">
      <div style="width: 100%; min-height: 100%; padding: 1in 1.25in; overflow-y: auto; height: 100%" id="report-page">
        <div class="text-h3" style="flex-shrink: 0; flex-grow: 0" @click="(e) => doExport()">
          {{ report.theme }}
        </div>

        <div v-for="(day, dayIndex) in Object.values(report.dayReports)" :key="dayIndex" style="display: flex; flex-direction: column">
          <div class="text-h4">{{ getWeekDay(dayIndex) }}</div>
          <div style="font-size: 14pt; font-family: Tahoma, sans-serif">
            <p v-for="p in paragraphs(day.description)" :key="p">{{ p }}</p>
          </div>
          <div v-for="image in day.images" :key="image" style="page-break-before: always">
            <img :src="image" style="width: 100%; height: 100%; object-fit: contain" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useWeekReportStore } from 'src/stores/weekReport';
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import domToPdf from 'dom-to-pdf';
import { jsPDF } from 'jspdf';

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

  methods: {
    getWeekDay(index: number) {
      const DAYS = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
      return DAYS[index];
    },

    paragraphs(text: string): string[] {
      return text.replace(/\n\s*\n/g, '\n').split('\n');
    },

    doExport() {
      // const doc = new jsPDF();

      var source = window.document.getElementById('report-page');
      if (source == null) {
        return;
      }
      // doc.html(source, {
      //   callback: function (doc) {
      //     doc.save();
      //   },
      //   x: 10,
      //   y: 10,
      // });
      // doc.autoPrint();
      // doc.output('dataurlnewwindow');

      // //doc.save('verslag.pdf');

      domToPdf(
        source,
        {
          margins: {
            top: 20, // Top margin in millimeters
            right: 20, // Right margin in millimeters
            bottom: 20, // Bottom margin in millimeters
            left: 20, // Left margin in millimeters
          },
          filename: 'test.pdf',
        },
        function (pdf: never) {
          console.log('done');
        }
      );
    },
  },
});
</script>

<style>
@page {
  margin: 20mm;
}
</style>
