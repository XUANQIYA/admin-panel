import VueRouter from "vue-router";
import UserManagePage from "@/components/pages/userManage/UserManagePage.vue";
import UserPopup from "@/components/pages/userManage/UserPopup.vue";
import PostManagePage from "@/components/pages/postManage/PostManagePage.vue";
import PostPopup from "@/components/pages/postManage/PostPopup.vue";
import ReportManagePage from "@/components/pages/reportManage/ReportManagePage.vue";
import ReportPopup from "@/components/pages/reportManage/ReportPopup.vue";

const router = new VueRouter({
  mode: "hash",
  routes: [
    {
      name: "UserManagePage",
      path: "/UserManagePage",
      component: UserManagePage,
      children: [
        {
          name: "UserPopup",
          component: UserPopup,
          path: "UserPopup/:id",
          props: (route) => ({
            id: Number(route.params.id),
          }),
        },
      ],
    },
    {
      name: "PostManagePage",
      path: "/PostManagePage",
      component: PostManagePage,
      children: [
        {
          name: "PostPopup",
          component: PostPopup,
          path: "UserPopup/:id",
          props: (route) => ({
            id: Number(route.params.id),
          }),
        },
      ],
    },
    {
      name: "ReportManagePage",
      path: "/ReportManagePage",
      component: ReportManagePage,
      children: [
        {
          name: "ReportPopup",
          path: "ReportPopup/:id",
          component: ReportPopup,
          props: (route) => ({
            id: Number(route.params.id),
          }),
        },
      ],
    },
  ],
});

export default router;
