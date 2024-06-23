<template>
  <q-list style="width: 100%; height: 100%; overflow-y: scroll" class="q-gutter-y-sm">
    <template v-if="weekReports.length">
      <q-item v-for="report in weekReports" :key="report.id" clickable @click="reportClicked(report)" class="rounded-borders" style="overflow: hidden; border: 1px solid lightgray">
        <q-item-section>
          <q-item-label class="text-h5">{{ report.theme }}</q-item-label>
          <q-item-label caption>{{ formatDate(report.startDate) }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <q-item v-else>
      <q-item-section>
        <q-item-label>No reports available</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script lang="ts">
import WeekReport from 'src/data/models/WeekReport';
import DateUtils from 'src/libs/DateUtils';
import { PropType, defineComponent } from 'vue';

export default defineComponent({
  props: {
    weekReports: {
      type: Array as PropType<WeekReport[]>,
      required: true,
    },
  },
  methods: {
    formatDate(date: Date) {
      const weekNumber = DateUtils.getWeekNumber(date);
      const dateStr = new Date(date).toLocaleDateString();
      return `Week ${weekNumber}, ${dateStr}`;
    },
    reportClicked(report: WeekReport) {
      this.$emit('report-clicked', report);
    },
  },
});
</script>

<style scoped>
/* Add any custom styles here */
</style>
