export default [
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
];
