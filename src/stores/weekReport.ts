import { defineStore } from 'pinia';
import WeekReport from 'src/data/models/WeekReport';

export const useWeekReportStore = defineStore({
  id: 'weekReport',
  state: () => ({
    weekReports: [] as WeekReport[],
  }),
  actions: {
    addReport(report: WeekReport) {
      this.weekReports.push(report);
    },
    searchReports(keyword: string) {
      return this.weekReports.filter((report) => report.theme.toLowerCase().includes(keyword.toLowerCase()));
    },
    get(id: string) {
      return this.weekReports.find((report) => report.id === id);
    },
  },
});
