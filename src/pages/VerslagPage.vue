<template>
  <q-page padding>
    <div class="text-h3">{{ report.theme }}</div>
    <!-- content -->
  </q-page>
</template>

<script lang="ts">
import WeekReport from 'src/data/models/WeekReport';
import { useWeekReportStore } from 'src/stores/weekReport';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VerslagPage',

  setup() {
    const weekReportStore = useWeekReportStore();
    // Your setup logic goes here

    return {
      weekReportStore,
    };
  },

  computed: {
    reportId(): string {
      return this.$route.query['reportId'] as string;
    },
    report() {
      const report = this.weekReportStore.get(this.reportId);
      if (report === undefined) {
        throw new Error('Report is not found');
      }

      return report as WeekReport;
    },
  },
});
</script>
