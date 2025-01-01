import { createRouter, createWebHistory } from "vue-router";

// Import components
import SignIn from "@/components/auth/SignIn.vue";
import SignUp from "@/components/auth/SignUp.vue";
import ForgotPassword from "../components/auth/ForgotPassword.vue";
import ResetPassword from "../components/auth/ResetPassword.vue"
// Define routes
const routes = [
  { path: "/", redirect: "/signin" },
  { path: "/signin", component: SignIn },
  { path: "/signup", component: SignUp },
  { path: "/forgot-password", component: ForgotPassword },
  { path: "/reset-password/:token", component: ResetPassword, props: true }, 
];

// Create and export the router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
