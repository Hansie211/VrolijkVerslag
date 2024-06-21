import { boot } from 'quasar/wrappers';
import { useWeekReportStore } from 'src/stores/weekReport';

export default boot(async () => {
  const store = useWeekReportStore();
  await store.$persistedState.isReady();
});
