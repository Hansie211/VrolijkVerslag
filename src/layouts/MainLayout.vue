<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> {{ APP_TITLE }} </q-toolbar-title>

        <div>{{ APP_VERSION }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div id="debug-banner">DEBUG</div>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { getProperty } from 'src/data/ApplicationProperties';
import getAppVersion from 'src/data/Version';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const APP_TITLE = getProperty('title');
    const APP_VERSION = getAppVersion();

    return {
      APP_TITLE,
      APP_VERSION,
    };
  },
});
</script>

<style scoped>
#debug-banner {
  width: 200px;
  font-weight: bold;
  color: white;
  background-color: red;
  text-align: center;
  border: 2px solid gold;
  rotate: 45deg;
  position: absolute;
  font-size: 1.6em;

  top: 40px;
  right: -45px;
  z-index: 2000;
}
</style>
