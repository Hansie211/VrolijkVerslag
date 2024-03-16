import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue'), name: 'IndexPage' }],
  },
  {
    path: '/verslag',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/VerslagPage.vue'), name: 'VerslagPage' }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
