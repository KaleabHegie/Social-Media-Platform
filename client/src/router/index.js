import { createRouter, createWebHistory } from "vue-router";

// Import components
import SignIn from "@/components/auth/SignIn.vue";
import SignUp from "@/components/auth/SignUp.vue";
// Define routes
const routes = [
  { path: "/", redirect: "/signin" },
  { path: "/signin", component: SignIn },
  { path: "/signup", component: SignUp },
  //   { path: '/forgot-password', component: ForgotPassword },
];

// Create and export the router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
