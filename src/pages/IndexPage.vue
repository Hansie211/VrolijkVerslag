<template>
  <q-page class="row items-center justify-evenly">
    <div class="container q-gutter-x-lg">
      <report-list :weekReports="weekReports" @report-clicked="handleReportClicked" />
      <create-report @report-created="handleReportCreated" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useWeekReportStore } from 'src/stores/weekReport';
import WeekReport from 'src/data/models/WeekReport';
import ReportList from 'src/components/ReportList.vue';
import CreateReport from 'src/components/CreateReport.vue';

export default defineComponent({
  components: {
    ReportList,
    CreateReport,
  },
  setup() {
    const store = useWeekReportStore();

    return {
      // Expose the store for use in the template if needed
      weekReports: store.weekReports,
    };
  },
  methods: {
    openReport(report: WeekReport) {
      this.$router.push({ name: 'VerslagPage', query: { reportId: report.id } });
    },

    handleReportClicked(report: WeekReport) {
      this.openReport(report);
    },
    handleReportCreated(report: WeekReport) {
      console.log('Report created:', report);
    },
  },
});
</script>

<style scoped>
.container {
  display: flex;
  width: 1000px;
  height: 600px;
}

.container > * {
  flex: 1;
  height: 100%;
  overflow: auto;
}
</style>
