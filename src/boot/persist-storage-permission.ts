import { boot } from 'quasar/wrappers';

export default boot(async (/* { app, router, ... } */) => {
  if (navigator.storage && navigator.storage.persist) {
    await navigator.storage.persist();
  }
});
