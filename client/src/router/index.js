import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

// Import views
import SignIn from "@/views/auth/SignIn.vue";
import SignUp from "@/views/auth/SignUp.vue";
import ForgotPassword from "@/views/auth/ForgotPassword.vue";
import ResetPassword from "@/views/auth/ResetPassword.vue";

import BaseLayout from "@/views/BaseLayout.vue";
import Home from "@/views/userPages/Home.vue";
import Explore from "@/views/userPages/Explore.vue";
import Account from "@/views/userPages/Account.vue";
import CreatePost from "@/views/userPages/CreatePost.vue";
import Messages from "@/views/userPages/Messages.vue";
import ViewPost from "@/views/userPages/ViewPost.vue";
import MyAccount from "../views/userPages/MyAccount.vue";
import AdminBaseLayout from "../views/AdminBaseLayout.vue";
import UsersView from "../views/adminPages/UsersView.vue";
import ReportsView from "../views/adminPages/ReportsView.vue";
import Analytics from "../views/adminPages/Analytics.vue";

// Routes
const routes = [
  { path: "/signin", component: SignIn, meta: { requiresAuth: false } },
  { path: "/signup", component: SignUp, meta: { requiresAuth: false } },
  { path: "/forgot-password", component: ForgotPassword, meta: { requiresAuth: false } },
  {
    path: "/reset-password/:token",
    component: ResetPassword,
    props: true,
    meta: { requiresAuth: false },
  },

  {
    path: "/",
    component: BaseLayout,
    children: [
      { path: "home", component: Home, meta: { requiresAuth: true } },
      { path: "explore/:hashtag?", component: Explore, meta: { requiresAuth: true } },
      { path: "MyAccount", component: MyAccount, meta: { requiresAuth: true } },
      { path: "viewAccount/:id", component: Account, meta: { requiresAuth: true } },
      { path: "createpost", component: CreatePost, meta: { requiresAuth: true } },
      { path: "messages", component: Messages, meta: { requiresAuth: true } },
      { path: "viewpost/:id", component: ViewPost, meta: { requiresAuth: true } },
    ],
  },

  {
    path: "/admin",
    component: AdminBaseLayout,
    children: [
      { path: "/userView", component: UsersView, meta: { requiresAuth: false } },
      { path: "/reportedPosts", component: ReportsView, meta: { requiresAuth: false } },
      { path: "/analytics", component: Analytics, meta: { requiresAuth: false } },
    ],
  },

  { path: "/:pathMatch(.*)*", redirect: "/signin" }, // Redirect unknown routes to SignIn
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const adminRoutes = ["/userView", "/reportedPosts", "/analytics"];

  // Check authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ path: "/signin" });
  }
  // Prevent authenticated users from accessing SignIn
  else if (to.path === "/signin" && authStore.isAuthenticated) {
    next({ path: "/home" });
  }

  const isAdmin = localStorage.getItem("isAdmin") === "true"; // Ensure 'true' is a string

  // Check if the route is an admin route and the user is not an admin
  if (adminRoutes.includes(to.path) && !isAdmin) {
    next({ path: "/home" }); // Redirect non-admin users
  } else {
    next(); // Allow access
  }
});

export default router;
