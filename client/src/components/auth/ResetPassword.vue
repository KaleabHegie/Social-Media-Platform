<template>
    <div
        class="min-h-screen bg-white rounded-lg shadow-xl overflow-hidden flex items-center justify-center py-12 sm:px-6 lg:px-8">
        <div class="w-full max-w-md">
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <!-- Logo Section -->
                <div class="text-center -mt-24 h-64">
                    <img src="@/assets/logo.svg" alt="Tsede Logo" />
                </div>

                <!-- Language Dropdown -->
                <div class="text-right mb-10">
                    <button @click="switchLanguage" class="bg-sky-400 hover:bg-sky-400 text-white px-3 py-1 rounded">
                        {{ currentLanguage === 'en' ? 'አማ' : 'Eng' }}
                    </button>
                </div>

                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">{{ t('reset') }}</h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    {{ t('or') }}
                    <router-link to="/signin" class="font-medium text-sky-400 hover:text-sky-500">
                        {{ t('return') }}
                    </router-link>
                </p>
                <!-- Form -->
                <form @submit.prevent="nextStep">
                    <div>
                        <div class="mb-4">
                            <label for="password"
                                class="block text-sm font-medium text-gray-700 bg-white px-1 ml-2 -mb-3 z-10 relative w-fit">
                                {{ t('password') }}
                            </label>
                            <input id="password" v-model="formData.password" type="password" required
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400" />
                            <!-- Error message -->
                            <p v-if="errors.password" class="text-sm text-red-600 mt-1">{{ errors.password }}</p>
                        </div>
                        <div class="mb-4">
                            <label for="confirm-password"
                                class="block text-sm font-medium text-gray-700 bg-white px-1 ml-2 -mb-3 z-10 relative w-fit">
                                {{ t('confirmpass') }}
                            </label>
                            <input id="confirm-password" v-model="formData.confirm_password" type="password" required
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400" />
                            <!-- Error message -->
                            <p v-if="errors.confirm_password" class="text-sm text-red-600 mt-1">{{
                                errors.confirm_password }}</p>
                        </div>
                    </div>

                    <div>
                        <button type="button" @click="handleSubmit"
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-400 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                            <span> {{ t('submit') }}</span>
                        </button>

                    </div>

                    <!-- Navigation Buttons -->

                </form>


            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useLanguageStore } from '@/stores/languageStore';
import { useAuthStore } from '@/stores/authStore';

import { useRoute } from 'vue-router';

const route = useRoute();
const token = route.params.token;
// Store access
const languageStore = useLanguageStore();
const t = (key) => languageStore.t.value(key);

const currentLanguage = languageStore.currentLanguage;
const switchLanguage = languageStore.switchLanguage;

const formData = reactive({
    password: '',
    confirm_password: '',
    token : token
});

const errors = reactive({
    password: '',
    confirm_password: '',
});

// Validation function that runs only on submit
const isValid = () => {
  // First, check if the password is provided
  if (!formData.password) {
    errors.password = 'Password is required.';
    return false;
  }

  // Password validations
  const hasLetter = /[A-Za-z]/.test(formData.password);
  const hasNumber = /\d/.test(formData.password);
  const hasSpecialChar = /[@$!%*#?&]/.test(formData.password);
  const isLongEnough = formData.password.length >= 8;

  if (!isLongEnough) {
    errors.password = 'Password must be at least 8 characters long.';
  } else if (!hasLetter) {
    errors.password = 'Password must include at least one letter.';
  } else if (!hasNumber) {
    errors.password = 'Password must include at least one number.';
  } else if (!hasSpecialChar) {
    errors.password = 'Password must include at least one special character (@, $, !, %, *, #, ?, &).';
  }

  // Check if the confirm password matches the password
  errors.confirm_password = formData.password !== formData.confirm_password ? 'Passwords do not match.' : '';

  // Return true if no errors are found
  return !errors.password && !errors.confirm_password;
};


// Form Submission
const handleSubmit = async () => {
    if (!isValid()) {
        return; 
    }

    const authStore = useAuthStore();

    try {
        const success = await authStore.resetPassword(formData);
        if (success) {
            router.push('/signin');
        } else {
            alert(authStore.error || 'Password Reset failed.');
        }
    } catch (err) {
        console.error('Error submitting form:', err);
    }
};
</script>
