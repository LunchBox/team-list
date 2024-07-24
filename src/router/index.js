import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Dashboard,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },

    {
      path: "/nodes/:id/edit",
      name: "edit_node",
      component: () => import("../views/nodes/EditView.vue"),
    },
    {
      path: "/nodes/:id/gantt",
      name: "node_gantt_view",
      component: () => import("../views/nodes/GanttView.vue"),
    },
    {
      path: "/nodes/:id",
      name: "node",
      component: () => import("../views/nodes/ListView.vue"),
    },
  ],
});

export default router;
