<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});

// function dummy_reports() {
//   let date = new Date(2024, 1, 26);

//   return ['Dierenweek', 'Kleurenweek', 'Natuurweek', 'Verkeersweek', 'Sportweek', 'Ruimteweek', 'Techniekweek', 'Gezondheidsweek', 'Sprookjesweek', 'Fantasieweek', 'Muziekweek', 'Kunstweek', 'Boekenweek', 'Waterweek', 'Feestweek', 'Plantenweek', 'Voertuigenweek', 'Wereldweek', 'Beroepenweek', 'Bouwweek', 'Modderweek', 'Bakweek'].map((theme) => {
//     date.setDate(date.getDate() - 7);
//     return WeekReport.create(theme, new Date(date));
//   });
// }
</script>
