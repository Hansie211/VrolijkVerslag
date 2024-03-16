import { boot } from 'quasar/wrappers';

export default boot(async (/* { app, router, ... } */) => {
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persist();
    console.log(`Persisted storage granted: ${isPersisted}`);
  }
});
