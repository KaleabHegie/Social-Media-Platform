<template>
  <div class=" min-h-screen bg-white rounded-lg shadow-xl overflow-hidden flex items-center justify-center py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Logo Section -->
        <div class="text-center -mt-24 h-64">
          <img src="@/assets/logo.png" alt="Tsede Logo" />
        </div>

        <!-- Language Dropdown -->
        <div class="text-right mb-10">
          <button @click="switchLanguage" class="bg-sky-400 hover:bg-sky-400 text-white px-3 py-1 rounded">
            {{ currentLanguage === 'en' ? 'አማርኛ' : 'English' }}
          </button>
        </div>

        <!-- Form Section -->
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Username or Email -->
          <div class="relative">
            <label for="username" class="absolute -top-2 left-2 bg-white text-sm font-medium text-gray-700 px-1">
              Username or email
            </label>
            <div class="mt-2">
              <input id="username" v-model="form.username" type="text" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                :class="{ 'border-red-500': errors.username }" />
            </div>
            <!-- Display error -->
            <p v-if="errors.username" class="text-sm text-red-500 mt-1">{{ errors.username }}</p>
          </div>

          <!-- Password -->
          <div class="relative">
            <label for="password" class="absolute -top-2 left-2 bg-white text-sm font-medium text-gray-700 px-1">
              Password
            </label>
            <div class="mt-2">
              <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                :class="{ 'border-red-500': errors.password }" />
              <!-- Toggle Password Visibility Button -->
              <button type="button" @click="togglePasswordVisibility"
                class="absolute right-3 top-3 text-sky-400 hover:text-sky-500" aria-label="Toggle password visibility">
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path
                    d="M1 12C2.732 7.943 7.02 5 12 5s9.268 2.943 11 7c-1.732 4.057-6.02 7-11 7s-9.268-2.943-11-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" stroke-width="2">
                  <path
                    d="M1 12C2.732 7.943 7.02 5 12 5s9.268 2.943 11 7c-1.732 4.057-6.02 7-11 7s-9.268-2.943-11-7z" />
                  <path
                    d="M3.515 3.515l17 17M9.172 9.172A3.001 3.001 0 0112 9c1.657 0 3 1.343 3 3 0 .828-.336 1.578-.88 2.121m-.948.947a2.999 2.999 0 01-4.24-4.24" />
                </svg>
              </button>
            </div>
            <!-- Display error -->
            <p v-if="errors.password" class="text-sm text-red-500 mt-1">{{ errors.password }}</p>
          </div>

          <!-- Remember Me and Forgot Password Section -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" v-model="form.rememberMe" type="checkbox"
                class="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded" />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-sky-400 hover:text-sky-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button type="submit" :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-400 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
              <span v-if="loading">Signing in...</span>
              <span v-else>Sign in</span>
            </button>
          </div>
          <!-- Sign Up Section -->
          <p class="text-sm text-center text-gray-900">
            Don't have an account?
            <router-link to="/signup" class="font-medium text-sky-400 hover:text-sky-500">
              Sign up
            </router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLanguageStore } from '@/stores/languageStore';
import { useAuthStore } from '@/stores/authStore';

// Access the language store
const { currentLanguage, switchLanguage, t } = useLanguageStore();

// Define form data and state
const form = reactive({
  username: '',
  password: '',
  rememberMe: false,
});
const errors = reactive({});
const loading = ref(false);
const showPassword = ref(false);
const selectedLanguage = ref('en'); // Default language

// Router instance
const router = useRouter();

// Methods
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach((key) => delete errors[key]);

  // Username or Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (form.username.includes('@') || emailRegex.test(form.username)) {
    // Assume it's an email
    const hasAtSymbol = /@/.test(form.username);
    const hasDomain = /\.[a-zA-Z]{2,}$/.test(form.username);

    if (!hasAtSymbol) {
      errors.username = "Email must include an '@' symbol.";
    } else if (!hasDomain) {
      errors.username = "Email must include a valid domain (e.g., '.com').";
    } else if (!emailRegex.test(form.username)) {
      errors.username = 'Please enter a valid email address.';
    }
  } else {
    // Treat as a username if it's not a valid email
    if (form.username.length < 3) {
      errors.username = 'Username must be at least 3 characters long.';
    }
  }

  // Password validation
  const hasLetter = /[A-Za-z]/.test(form.password);
  const hasNumber = /\d/.test(form.password);
  const hasSpecialChar = /[@$!%*#?&]/.test(form.password);
  const isLongEnough = form.password.length >= 8;

  if (!isLongEnough) {
    errors.password = 'Password must be at least 8 characters long.';
  } else if (!hasLetter) {
    errors.password = 'Password must include at least one letter.';
  } else if (!hasNumber) {
    errors.password = 'Password must include at least one number.';
  } else if (!hasSpecialChar) {
    errors.password = 'Password must include at least one special character (@, $, !, %, *, #, ?, &).';
  }

  return Object.keys(errors).length === 0;
};



const changeLanguage = () => {
  if (selectedLanguage.value === 'am') {
    router.push('/signin-amharic');
  } else {
    router.push('/signin');
  }
};




const authStore = useAuthStore();






const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;

  const credentials = {
    username: form.username,
    password: form.password,
  };


  
  
  const success = await authStore.login(credentials);
  loading.value = false;

  if (success) {
    router.push('/dashboard'); // Navigate to the dashboard after login
  } else {
    errors.general = authStore.error || 'Login failed';
  }
};

</script>
