import { createRouter, createWebHistory } from "vue-router";

// Import components
import SignIn from "@/components/auth/SignIn.vue";
import SignInAmharic from "@/components/auth/SignInAmharic.vue";
import HomePage from "@/components/auth/HomePage.vue";
// import SignUp from '@/components/auth/SignUp.vue';
// import SignUpAmharic from '@/components/auth/SignUpAmharic.vue';
// import ForgotPassword from '@/components/auth/ForgotPassword.vue';
// import ForgotPasswordAmharic from '@/components/auth/ForgotPasswordAmharic.vue';

// Define routes
const routes = [
  { path: "/", redirect: "/signin" },
  { path: "/signin", component: SignIn },
  { path: "/signin-amharic", component: SignInAmharic },
  { path: "/homepage", component: HomePage },
  //   { path: '/signup', component: SignUp },
  //   { path: '/signup-amharic', component: SignUpAmharic },
  //   { path: '/forgot-password', component: ForgotPassword },
  //   { path: '/forgot-password-amharic', component: ForgotPasswordAmharic },
];

// Create and export the router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
