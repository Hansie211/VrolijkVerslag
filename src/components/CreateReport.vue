<template>
  <div class="q-gutter-sm">
    <!-- Theme input -->
    <div class="row">
      <div class="text-h4">Nieuw verslag</div>
    </div>

    <!-- Theme input -->
    <div class="row">
      <q-input ref="input" autofocus v-model="theme" label="Thema" class="col" @keydown.enter="createReport" error-message="Veld is verplicht" :error="!isThemeSet" />
    </div>

    <!-- Date picker -->
    <div class="row">
      <q-date v-model="startDate" :input="true" landscape mask="YYYY-MM-DD" :emit-model-value="true" picker="calendar" :options="(date) => new Date(date).getDay() === 1" label="Start Date" class="col" />
    </div>

    <!-- Create button -->
    <div class="row justify-end">
      <q-btn @click="createReport" color="primary" label="Aanmaken" />
    </div>
  </div>
</template>

<script lang="ts">
import WeekReport from 'src/data/models/WeekReport';
import { Ref, defineComponent, ref } from 'vue';

export default defineComponent({
  setup(props, { emit }) {
    const theme = ref('');
    const startDate: Ref<string> = ref(getLastMonday());
    const isThemeSet = ref(true);

    const createReport = () => {
      if (!theme.value) {
        isThemeSet.value = false;
        return;
      }

      isThemeSet.value = true;

      const [year, month, day] = startDate.value.split('-');

      const report = WeekReport.create(theme.value, new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
      emit('report-created', report);
    };

    return {
      theme,
      startDate,
      isThemeSet,
      createReport,
    };
  },
});

function getLastMonday(): string {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust if Sunday
  const lastMonday = new Date(today.setDate(diff));
  return lastMonday.toISOString().slice(0, 10); // Format as 'YYYY-MM-DD'
}
</script>
