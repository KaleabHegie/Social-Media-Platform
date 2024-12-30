import { createRouter, createWebHistory } from "vue-router";

// Import components
import SignIn from "@/components/auth/SignIn.vue";
import HomePage from "@/components/auth/HomePage.vue";
import SignUp from "@/components/auth/SignUp.vue";
// import ForgotPassword from '@/components/auth/ForgotPassword.vue';
// Define routes
const routes = [
  { path: "/", redirect: "/signin" },
  { path: "/signin", component: SignIn },
  { path: "/homepage", component: HomePage },
  { path: "/signup", component: SignUp },
  //   { path: '/forgot-password', component: ForgotPassword },
  //   { path: '/forgot-password-amharic', component: ForgotPasswordAmharic },
];

// Create and export the router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
