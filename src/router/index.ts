import { createRouter, 
  createWebHashHistory,
  RouteRecordRaw,
 } from 'vue-router'
import routes from '@router/router'

const router = createRouter({
  history: createWebHashHistory(''),
  routes
})

router.beforeEach((to, from, next) => {
  next();
//  if (to.path === "/add") {
//  if (localStorage.getItem("token")) {
//  next();
//  } else {
//  next({ path: "/login", query: { redirect: to.path } });
//  }
//  } else {
//  next();
//  }
});

export default router