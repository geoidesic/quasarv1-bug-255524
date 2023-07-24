import Vue from "vue";

import VueRouter from "vue-router";

import createRoute from "./routes";

Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function ({ Vue, store } /* { store, ssrContext } */) {
  const Router = new VueRouter({
    routes: createRoute(Vue, store),
    scrollBehavior: () => ({ x: 0, y: 0 }),
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
  });

  // @why? - to disable the sidebar
  // @deprecated: not necessary as links can be disabled in the Nav component and this breaks unauthenticated routes like login
  // Router.beforeEach((to, from, next) => {
  //   const inValidRoute = to.path !== "/" && !store.getters["schemas/isLoaded"];
  //   if (inValidRoute) {
  //     next({ path: "/" });
  //     return;
  //   }
  //   next();
  // });
  return Router;
}
