import { defineStore } from 'pinia';
import WeekReport, { DayImage } from 'src/data/models/WeekReport';
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
        state.weekReports.forEach((e) => patchReport(e));
        return state;
      },
    },
  }
);

function patchReport(report: WeekReport) {

  report.startDate = new Date(report.startDate);

  Object.keys(report.dayReports).forEach(dayIndex => {
    const dayReport = report.dayReports[parseInt(dayIndex)];
    dayReport.images = [...dayReport.images].map(image => {
      if (typeof image !== 'string') {
        return image;
      }

      return { image, text: ''} as DayImage;
    });

  });



}
