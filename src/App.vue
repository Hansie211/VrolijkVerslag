<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WeekReport from './data/models/WeekReport';
import { useWeekReportStore } from './stores/weekReport';

export default defineComponent({
  name: 'App',
  setup() {
    const store = useWeekReportStore();

    dummy_reports().forEach((report) => store.addReport(report));
  },
});

function dummy_reports() {
  let date = new Date(2024, 1, 26);

  return ['Dierenweek', 'Kleurenweek', 'Natuurweek', 'Verkeersweek', 'Sportweek', 'Ruimteweek', 'Techniekweek', 'Gezondheidsweek', 'Sprookjesweek', 'Fantasieweek', 'Muziekweek', 'Kunstweek', 'Boekenweek', 'Waterweek', 'Feestweek', 'Plantenweek', 'Voertuigenweek', 'Wereldweek', 'Beroepenweek', 'Bouwweek', 'Modderweek', 'Bakweek'].map((theme) => {
    date.setDate(date.getDate() - 7);
    return WeekReport.create(theme, new Date(date));
  });
}
</script>
