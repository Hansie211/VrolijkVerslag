import { defineStore } from 'pinia';
import WeekReport from 'src/data/models/WeekReport';
import { Ref, ref } from 'vue';

export const useWeekReportStore = defineStore(
  'weekReport',
  () => {
    const weekReports: Ref<WeekReport[]> = ref([]);

    const get = (id: string): WeekReport | undefined => {
      return (weekReports.value as WeekReport[]).find((report) => report.id === id);
    };

    const addReport = (report: WeekReport) => weekReports.value.push(report);
    return {
      weekReports,
      get,
      addReport,
    };
  },
  {
    persistedState: {
      migrate: (state: { weekReports: WeekReport[] }) => {
        state.weekReports.forEach((e) => (e.startDate = new Date(e.startDate)));
        return state;
      },
    },
  }
);
