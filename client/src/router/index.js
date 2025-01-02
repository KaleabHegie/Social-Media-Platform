import { createRouter, createWebHistory } from "vue-router";

// Import components
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

// Define routes
const routes = [
  { path: "/signin", component: SignIn },
  { path: "/signup", component: SignUp },
  { path: "/forgot-password", component: ForgotPassword },
  { path: "/reset-password/:token", component: ResetPassword, props: true },

  // Routes with BaseLayout (wrapped in children)
  {
    path: "/tesde",
    component: BaseLayout, // Use BaseLayout for this route and children
    children: [
      {
        path: "/home",
        children: [
          {
            path: "",
            component: Home,
          },
        ],
      },
      {
        path: "/explore",
        children: [
          {
            path: "",
            component: Explore,
          },
        ],
      },
      {
        path: "/account",
        children: [
          {
            path: "",
            component: Account,
          },
        ],
      },
      {
        path: "/createpost",
        children: [
          {
            path: "",
            component: CreatePost,
          },
        ],
      },
      {
        path: "/messages",
        children: [
          {
            path: "",
            component: Messages,
          },
        ],
      },
    ],
  },
];

// Create and export the router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
