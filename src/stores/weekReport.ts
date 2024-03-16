import { defineStore } from 'pinia';
import WeekReport from 'src/data/models/WeekReport';
import { Ref, ref } from 'vue';

export const useWeekReportStore = defineStore(
  'weekReport',
  () => {
    const weekReports: Ref<WeekReport[]> = ref([]);

    const get = (id: string) => {
      console.log('Find', id, 'in', weekReports.value);
      return weekReports.value.find((report) => report.id === id);
    };
    const addReport = (report: WeekReport) => weekReports.value.push(report);
    return {
      weekReports,
      get,
      addReport,
    };
  },
  {
    // id: 'weekReport',
    // state: () => ({
    //   weekReports: [] as WeekReport[],
    // }),
    // actions: {
    //   addReport(report: WeekReport) {
    //     this.weekReports.push(report);
    //   },
    //   get(id: string) {
    //     return this.weekReports.find((report) => report.id === id);
    //   },
    // },
    persistedState: {
      migrate: (state) => {
        (state.weekReports as WeekReport[]).forEach((e) => (e.startDate = new Date(e.startDate)));
        return state;
      },
    },
  }
  // persist: {
  //   afterRestore({ store }) {
  //     console.log(store);
  //     store.weekReports.forEach((report: WeekReport) => {
  //       report.startDate = new Date(report.startDate);
  //       // Object.values(report.dayReports).forEach((day) => (day.images = []));
  //     });
  //   },
  // },
);
