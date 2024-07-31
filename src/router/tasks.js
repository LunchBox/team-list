export default [
  {
    path: "/tasks/:id/gantt",
    name: "tasks_gantt_view",
    component: () => import("../views/tasks/TaskGanttView.vue"),
  },

  {
    path: "/tasks/:id/table",
    name: "tasks_table_view",
    component: () => import("../views/tasks/tableView/TableView.vue"),
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
];
