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

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to SignIn if not authenticated
    next({ path: "/signin" });
  } else if (to.path === "/signin" && authStore.isAuthenticated) {
    // Redirect authenticated users away from SignIn
    next({ path: "/home" });
  } else {
    next(); // Proceed to the route
  }
});

export default router;
