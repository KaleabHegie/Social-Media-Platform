<template>
    <div
        class="min-h-screen bg-white rounded-lg shadow-xl overflow-hidden flex items-center justify-center py-12 sm:px-6 lg:px-8">
        <div class="absolute inset-0 z-0">
            <img src="@/assets/whitebg.png" alt="" class="fixed w-full h-full object-cover opacity-40 dark:opacity-10" />
        </div>
        <div class="w-full max-w-md z-10">
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

                <!-- Progress Bar -->
                <div class="mb-6">
                    <div class="flex justify-between mb-2">
                        <span
                            class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-sky-400">
                            {{ t('step') }} {{ currentStep }} {{ t('of') }} 3
                        </span>
                    </div>
                    <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
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
                                class="block text-sm font-medium text-gray-700 bg-white px-1 ml-2 -mb-3 z-10 relative w-fit">
                                {{ t('usernameonly') }}
                            </label>
                            <input id="user_name" v-model="formData.user_name" type="text" required
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400" />
                            <!-- Error message -->
                            <p v-if="errors.user_name" class="text-sm text-red-600 mt-1">{{ errors.user_name }}</p>
                        </div>
                        <div class="mb-4">
                            <label for="first_name"
                                class="block text-sm font-medium text-gray-700 bg-white px-1 ml-2 -mb-3 z-10 relative w-fit">
                                {{ t('first_name') }}
                            </label>
                            <input id="first_name" v-model="formData.first_name" type="text" required
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400" />
                            <!-- Error message -->
                            <p v-if="errors.first_name" class="text-sm text-red-600 mt-1">{{ errors.first_name }}</p>
                        </div>
                        <div class="mb-4">
                            <label for="last_name"
                                class="block text-sm font-medium text-gray-700 bg-white px-1 ml-2 -mb-3 z-10 relative w-fit">
                                {{ t('last_name') }}
                            </label>
                            <input id="last_name" v-model="formData.last_name" type="text" required
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400" />
                            <!-- Error message -->
                            <p v-if="errors.last_name" class="text-sm text-red-600 mt-1">{{ errors.last_name }}</p>
                        </div>
                    </div>

                    <!-- Step 2 -->
                    <div v-if="currentStep === 2">
                        <div class="mb-4">
                            <label for="date_of_birth"
                                class="block text-sm font-medium text-gray-700 bg-white px-1 ml-2 -mb-3 z-10 relative w-fit">
                                {{ t('dateOfBirth') }}
                            </label>
                            <input id="date_of_birth" v-model="formData.date_of_birth" type="date"
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400" />
                            <!-- Error message -->
                            <p v-if="errors.date_of_birth" class="text-sm text-red-600 mt-1">{{ errors.date_of_birth }}
                            </p>
                        </div>
                        <div class="mb-6">
                            <label class="block text-sm font-semibold text-gray-700 mb-3"> {{ t('gender') }}</label>
                            <div class="flex items-center space-x-6">
                                <label class="inline-flex items-center cursor-pointer">
                                    <input type="radio" v-model="formData.gender" value="male"
                                        class="form-radio text-sky-400 border-gray-300 rounded-full focus:ring-2 focus:ring-sky-400" />
                                    <span class="ml-2 text-gray-800">{{ t('male') }}</span>
                                </label>
                                <label class="inline-flex items-center cursor-pointer">
                                    <input type="radio" v-model="formData.gender" value="female"
                                        class="form-radio text-sky-400 border-gray-300 rounded-full focus:ring-2 focus:ring-sky-400" />
                                    <span class="ml-2 text-gray-800">{{ t('female') }}</span>
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
                                class="block text-sm font-medium text-gray-700 bg-white px-1 ml-2 -mb-3 z-10 relative w-fit">
                                {{ t('email') }}
                            </label>
                            <input id="email" v-model="formData.email" type="email" required
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400" />
                            <!-- Error message -->
                            <p v-if="errors.email" class="text-sm text-red-600 mt-1">{{ errors.email }}</p>
                        </div>
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

                    <!-- Navigation Buttons -->
                    <div class="flex justify-between mt-6">
                        <button v-if="currentStep > 1" @click.prevent="prevStep"
                            class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-sky-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400">
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
                    <p class="text-sm text-center text-gray-900">
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

const toast = ToastService();

// Store access
const languageStore = useLanguageStore();
const t = (key) => languageStore.t.value(key);

const currentLanguage = languageStore.currentLanguage;
const switchLanguage = languageStore.switchLanguage;

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

// Validation Functions with Error Messages
const isValidStep1 = () => {
    errors.user_name = !formData.user_name ? 'Username is required.' : '';
    errors.first_name = !formData.first_name ? 'First name is required.' : '';
    errors.last_name = !formData.last_name ? 'Last name is required.' : '';
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

const isValidStep3 = () => {
    errors.password = !formData.password ? 'Password is required.' : '';
    errors.confirm_password = formData.password !== formData.confirm_password ? 'Passwords do not match.' : '';
    return !errors.password && !errors.confirm_password;
};

// Step Navigation
const nextStep = () => {
    if (currentStep.value === 1 && isValidStep1()) {
        currentStep.value++;
    } else if (currentStep.value === 2 && isValidStep2()) {
        currentStep.value++;
    } else if (currentStep.value === 3 && isValidStep3()) {
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
    const authStore = useAuthStore();

    try {
            const success = await authStore.register(formData);
            toast.success('Registration successful!', { position: "top-center" });
            router.push('/signin');
        
    } catch (err) {
        toast.error('An unexpected error occurred.', { position: "top-center" });
    }
};

</script>
