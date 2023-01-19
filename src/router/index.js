import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: "home",
      path: "/home",
      component: () => import("../views/Home.vue"),
      children: [
        {
          name: "store",
          path: ":acc",
          component: () => import("../views/Home.vue"),
        },
      ],
    },
    { path: "/:pathMatch(.*)*", redirect: "/home" },
    {
      name: "product",
      path: "/product/:id",
      component: () => import("../views/Product.vue"),
    },
    {
      name: "cart",
      path: "/cart",
      component: () => import("../views/CartPage.vue"),
    },
  ],
});

export default router;
