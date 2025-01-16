<template>
    <div class="min-h-screen bg-white  text-gray-900 dark:text-gray-300 dark:bg-gray-900  shadow-xl overflow-hidden flex items-center justify-center py-12 sm:px-6 lg:px-8"
        :class="{ 'dark': isDarkMode }">
        <div class="absolute inset-0 z-0">
            <img src="@/assets/whitebg.png" alt=""
                class="fixed w-full h-full object-cover opacity-40 dark:opacity-10" />
        </div>
        <div class="w-full max-w-md z-10">
            <div
                class="bg-white   text-gray-900 dark:text-gray-300 dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <!-- Logo Section -->
                <div class="text-center -mt-24 h-64">
                    <img src="@/assets/logo.svg" alt="Tsede Logo" />
                </div>

                <!-- Language Dropdown and Dark Mode Toggle -->
                <div class="flex justify-between items-center mb-10">
                    <button @click="toggleDarkMode" @keydown.space.prevent="toggleDarkMode"
                        class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                        :class="isDarkMode ? 'bg-gray-700' : 'bg-sky-100'" role="switch" :aria-checked="isDarkMode"
                        aria-label="Toggle dark mode">
                        <span
                            class="inline-block w-4 h-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out"
                            :class="isDarkMode ? 'translate-x-6' : 'translate-x-1'">
                            <SunIcon v-if="!isDarkMode" class="h-4 w-4 text-yellow-500" />
                            <MoonIcon v-else class="h-4 w-4 text-sky-500" />
                        </span>
                    </button>
                    <LanguageSelector />
                </div>
                <!-- Progress Bar -->
                <div class="mb-6">
                    <div class="flex justify-between mb-2">
                        <span
                            class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-sky-400">
                            {{ t('step') }} {{ currentStep }} {{ t('of') }} 3
                        </span>
                    </div>
                    <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-sky-200">
                        <div :style="{ width: `${(currentStep / 3) * 100}%` }"
                            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-sky-400">
                        </div>
                    </div>
                </div>

                <!-- Form -->
                <form @submit.prevent="nextStep">
                    <!-- Step 1 -->
                    <div v-if="currentStep === 1">
                        <div class="mb-4">
                            <label for="user_name"
                                class="block text-sm font-medium   bg-white dark:bg-gray-800  text-gray-900 dark:text-gray-300 px-1 ml-2 -mb-3 z-10 relative w-fit">
                                {{ t('usernameonly') }}
                            </label>
                            <input id="user_name" v-model="formData.user_name" type="text" required
                                class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800  text-gray-900 dark:text-gray-300 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400" />
                            <!-- Error message -->
                            <p v-if="errors.user_name" class="text-sm text-red-600 mt-1">{{ errors.user_name }}</p>
                        </div>
                        <div class="mb-4">
                            <label for="first_name"
                                class="block text-sm font-medium  bg-white dark:bg-gray-800  text-gray-900 dark:text-gray-300 px-1 ml-2 -mb-3 z-10 relative w-fit">
                                {{ t('first_name') }}
                            </label>
                            <input id="first_name" v-model="formData.first_name" type="text" required
                                class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800  text-gray-900 dark:text-gray-300 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400" />
                            <!-- Error message -->
                            <p v-if="errors.first_name" class="text-sm text-red-600 mt-1">{{ errors.first_name }}</p>
                        </div>
                        <div class="mb-4">
                            <label for="last_name"
                                class="block text-sm font-medium  bg-white dark:bg-gray-800  text-gray-900 dark:text-gray-300 px-1 ml-2 -mb-3 z-10 relative w-fit">
                                {{ t('last_name') }}
                            </label>
                            <input id="last_name" v-model="formData.last_name" type="text" required
                                class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800  text-gray-900 dark:text-gray-300 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400" />
                            <!-- Error message -->
                            <p v-if="errors.last_name" class="text-sm text-red-600 mt-1">{{ errors.last_name }}</p>
                        </div>
                    </div>

                    <!-- Step 2 -->
                    <div v-if="currentStep === 2">
                        <div class="mb-4">
                            <label for="date_of_birth"
                                class="block text-sm font-medium bg-white dark:bg-gray-800  text-gray-900 dark:text-gray-300 px-1 ml-2 -mb-3 z-10 relative w-fit">
                                {{ t('dateOfBirth') }}
                            </label>
                            <input id="date_of_birth" v-model="formData.date_of_birth" type="date"
                                class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800  text-gray-900 dark:text-gray-300 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400" />
                            <!-- Error message -->
                            <p v-if="errors.date_of_birth" class="text-sm text-red-600 mt-1">{{ errors.date_of_birth }}
                            </p>
                        </div>
                        <div class="mb-6">
                            <label class="block text-sm font-semibold  text-gray-900 dark:text-gray-300 mb-3"> {{
                                t('gender') }}</label>
                            <div class="flex items-center space-x-6">
                                <label class="inline-flex items-center cursor-pointer">
                                    <input type="radio" v-model="formData.gender" value="male"
                                        class="form-radio text-sky-400 border-gray-300 rounded-full focus:ring-2 focus:ring-sky-400" />
                                    <span class="ml-2  text-gray-900 dark:text-gray-300">{{ t('male') }}</span>
                                </label>
                                <label class="inline-flex items-center cursor-pointer">
                                    <input type="radio" v-model="formData.gender" value="female"
                                        class="form-radio text-sky-400 border-gray-300 rounded-full focus:ring-2 focus:ring-sky-400" />
                                    <span class="ml-2  text-gray-900 dark:text-gray-300">{{ t('female') }}</span>
                                </label>
                            </div>
                            <!-- Error message -->
                            <p v-if="errors.gender" class="text-sm text-red-600 mt-1">{{ errors.gender }}</p>
                        </div>
                    </div>

                    <!-- Step 3 -->
                    <div v-if="currentStep === 3">
                        <div class="mb-4">
                            <label for="email"
                                class="block text-sm font-medium bg-white dark:bg-gray-800  text-gray-900 dark:text-gray-300 px-1 ml-2 -mb-3 z-10 relative w-fit">
                                {{ t('email') }}
                            </label>
                            <input id="email" v-model="formData.email" type="email" required
                                class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800  text-gray-900 dark:text-gray-300 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400" />
                            <!-- Error message -->
                            <p v-if="errors.email" class="text-sm text-red-600 mt-1">{{ errors.email }}</p>
                        </div>
                        <!-- Password Field -->
                        <div class="relative mb-4">
                            <label for="password"
                                class="absolute -top-2 left-2 bg-white dark:bg-gray-800 text-sm font-medium  text-gray-900 dark:text-gray-300 px-1">
                                {{ t('password') }}
                            </label>
                            <div class="mt-2">
                                <input id="password" v-model="formData.password"
                                    :type="showPassword ? 'text' : 'password'" required
                                    class="appearance-none block w-full px-3 py-2 border bg-white dark:bg-gray-800 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                    :class="{ 'border-red-500': errors.password }" />
                                <!-- Toggle Password Visibility -->
                                <button type="button" @click="togglePasswordVisibility"
                                    class="absolute right-3 top-3 text-sky-400 hover:text-sky-500"
                                    aria-label="Toggle password visibility">
                                    <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path
                                            d="M1 12C2.732 7.943 7.02 5 12 5s9.268 2.943 11 7c-1.732 4.057-6.02 7-11 7s-9.268-2.943-11-7z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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

                        <!-- Confirm Password Field -->
                        <div class="relative mb-4">
                            <label for="confirm-password"
                                class="absolute -top-2 left-2 bg-white dark:bg-gray-800  text-sm font-medium  text-gray-900 dark:text-gray-300 px-1">
                                {{ t('confirmpass') }}
                            </label>
                            <div class="mt-2">
                                <input id="confirm-password" v-model="formData.confirm_password"
                                    :type="showPassword ? 'text' : 'password'" required
                                    class="appearance-none block w-full px-3 py-2 border bg-white dark:bg-gray-800 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                    :class="{ 'border-red-500': errors.confirm_password }" />
                                <!-- Toggle Password Visibility -->
                                <button type="button" @click="togglePasswordVisibility"
                                    class="absolute right-3 top-3 text-sky-400 hover:text-sky-500"
                                    aria-label="Toggle password visibility">
                                    <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path
                                            d="M1 12C2.732 7.943 7.02 5 12 5s9.268 2.943 11 7c-1.732 4.057-6.02 7-11 7s-9.268-2.943-11-7z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path
                                            d="M1 12C2.732 7.943 7.02 5 12 5s9.268 2.943 11 7c-1.732 4.057-6.02 7-11 7s-9.268-2.943-11-7z" />
                                        <path
                                            d="M3.515 3.515l17 17M9.172 9.172A3.001 3.001 0 0112 9c1.657 0 3 1.343 3 3 0 .828-.336 1.578-.88 2.121m-.948.947a2.999 2.999 0 01-4.24-4.24" />
                                    </svg>
                                </button>
                            </div>
                            <!-- Display error -->
                            <p v-if="errors.confirm_password" class="text-sm text-red-500 mt-1">{{
                                errors.confirm_password }}</p>
                        </div>

                    </div>

                    <!-- Navigation Buttons -->
                    <div class="flex justify-between mt-6">
                        <button v-if="currentStep > 1" @click.prevent="prevStep"
                            class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-sky-700 bg-sky-100 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400">
                            {{ t('previous') }}
                        </button>
                        <button type="submit"
                            class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-400 hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400">
                            {{ currentStep === 3 ? t('submit') : t('next') }}
                        </button>

                    </div>
                </form>

                <!-- Redirect -->
                <div class="mt-4 text-center">
                    <p class="text-sm text-center text-gray-900 dark:text-gray-300">
                        {{ t('haveaccount') }}
                        <router-link to="/signin" class="font-medium text-sky-400 hover:text-sky-500">
                            {{ t('signin') }}
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useLanguageStore } from '@/stores/languageStore';
import { useAuthStore } from '@/stores/authStore';
import ToastService from '@/utils/toast.js';
import LanguageSelector from '@/components/LanguageSelector.vue';
import { SunIcon, MoonIcon } from 'lucide-vue-next';
const authStore = useAuthStore();

const toast = ToastService();
// Dark mode state
const isDarkMode = ref(false);
// Store access
const { t } = useLanguageStore();

// Reactive Data
const currentStep = ref(1);
const formData = reactive({
    user_name: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    email: '',
    password: '',
    confirm_password: '',
});

const errors = reactive({
    user_name: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    email: '',
    password: '',
    confirm_password: '',
});

// Password visibility toggles
const showPassword = ref(false);

// Toggle visibility for both password fields
const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};
const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    updateTheme();
};

const updateTheme = () => {
    if (isDarkMode.value) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};
// Validation Functions with Error Messages
const isValidStep1 = async () => {
    errors.user_name = !formData.user_name ? 'Username is required.' : '';
    errors.first_name = !formData.first_name ? 'First name is required.' : '';
    errors.last_name = !formData.last_name ? 'Last name is required.' : '';
    if (!errors.user_name) {
        // Check username uniqueness
        const isUnique = await authStore.checkUniqueness({ type: "user_name", user_name: formData.user_name });
        if (isUnique.isUnique == false) {
            errors.user_name = 'Username is already taken.';
        }
    }
    return !errors.user_name && !errors.first_name && !errors.last_name;
};

const isValidStep2 = () => {
    errors.date_of_birth = !formData.date_of_birth ? 'Date of birth is required.' : '';
    errors.gender = !formData.gender ? 'Gender is required.' : '';

    const birthDate = new Date(formData.date_of_birth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const ageAdjustment = today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? -1 : 0;
    if (age + ageAdjustment < 13) {
        errors.date_of_birth = 'You must be at least 13 years old.';
    }

    return !errors.date_of_birth && !errors.gender;
};

const isValidStep3 = async () => {
    // Email validation
    errors.email = !formData.email ? 'Email is required.' : '';
    if (!errors.email) {
        // Check email uniqueness
        const isUnique = await authStore.checkUniqueness({ type: "email", email: formData.email });
        if (!isUnique.isUnique) {
            errors.email = 'Email is already taken.';
        }
    }

    // Password validation
    const hasLetter = /[A-Za-z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);
    const hasSpecialChar = /[@$!%*#?&]/.test(formData.password);
    const isLongEnough = formData.password && formData.password.length >= 8;
    if (!formData.password) {
        errors.password = 'Password is required.';
    } else if (!isLongEnough) {
        errors.password = 'Password must be at least 8 characters long.';
    } else if (!hasLetter) {
        errors.password = 'Password must include at least one letter.';
    } else if (!hasNumber) {
        errors.password = 'Password must include at least one number.';
    } else if (!hasSpecialChar) {
        errors.password = 'Password must include at least one special character (@, $, !, %, *, #, ?, &).';
    } else {
        errors.password = '';
    }

    // Confirm password validation
    errors.confirm_password = formData.password !== formData.confirm_password
        ? 'Passwords do not match.'
        : '';

    return !errors.email && !errors.password && !errors.confirm_password;
};

// Step Navigation
const nextStep = async () => {
    if (currentStep.value === 1 && await isValidStep1()) {
        console.log(isValidStep1())
        currentStep.value++;
    } else if (currentStep.value === 2 && isValidStep2()) {
        currentStep.value++;
    } else if (currentStep.value === 3 && await isValidStep3()) {
        handleSubmit();
    }
};

const prevStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--;
    }
};

const router = useRouter();
// Form Submission
const handleSubmit = async () => {
    try {
        const success = await authStore.register(formData);
        router.push('/signin');
        toast.success('Registration successful!', { position: "top-center" });
    } catch (err) {
        toast.error('An unexpected error occurred.', { position: "top-center" });
    }
};
</script>
