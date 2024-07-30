import { createRouter, createWebHashHistory } from "vue-router";
import Dashboard from "@/views/Dashboard.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
      path: "/nodes/:id/gantt",
      name: "node_gantt_view",
      component: () => import("../views/nodes/NodeGanttView.vue"),
    },

    {
      path: "/nodes/:id/table",
      name: "node_table_view",
      component: () => import("../views/nodes/tableView/TableView.vue"),
    },

    {
      path: "/nodes/:id/dual",
      name: "dual_nodes",
      component: () => import("../views/nodes/NodeDualView.vue"),
      children: [
        {
          path: ":sid",
          name: "vs_nodes",
          component: () => import("../views/nodes/NodeDualRight.vue"),
        },
      ],
    },

    {
      path: "/nodes",
      name: "nodes",
      component: () => import("../views/nodes/NodesDashboard.vue"),
      children: [
        {
          path: ":id/edit",
          name: "edit_node",
          component: () => import("../views/nodes/EditView.vue"),
        },
        {
          path: ":id",
          name: "node",
          component: () => import("../views/nodes/NodeDefaultView.vue"),
        },
      ],
    },

    {
      path: "/tasks/:id/gantt",
      name: "tasks_gantt_view",
      component: () => import("../views/tasks/TaskGanttView.vue"),
    },

    {
      path: "/tasks",
      name: "tasks",
      component: () => import("../views/tasks/TaskDashboard.vue"),
      children: [
        {
          path: ":id/edit",
          name: "edit_task",
          component: () => import("../views/tasks/EditView.vue"),
        },
        {
          path: ":id",
          name: "task",
          component: () => import("../views/tasks/NodeDefaultView.vue"),
        },
      ],
    },
  ],
});

export default router;
