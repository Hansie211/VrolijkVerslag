import { boot } from 'quasar/wrappers';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

export default boot(async ({ store }) => {
  store.use(piniaPluginPersistedstate);
});
