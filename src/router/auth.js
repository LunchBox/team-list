export default [
  {
    path: "/auth/register",
    name: "register",
    component: () => import("../views/auth/RegisterUser.vue"),
  },
  {
    path: "/auth/login",
    name: "login",
    component: () => import("../views/auth/LoginUser.vue"),
  },
];
