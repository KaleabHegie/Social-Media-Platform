<template>
    <div
        class="min-h-screen bg-white rounded-lg shadow-xl overflow-hidden flex items-center justify-center py-12 sm:px-6 lg:px-8">
        <div class="w-full max-w-md">
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <!-- Logo Section -->
                <div class="text-center -mt-24 h-64">
                    <img src="@/assets/logo.png" alt="Tsede Logo" />
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
                            Step {{ currentStep }} of 3
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
                        </div>
                        <div class="mb-4">
                            <label for="first_name"
                                class="block text-sm font-medium text-gray-700 bg-white px-1 ml-2 -mb-3 z-10 relative w-fit">
                                {{ t('first_name') }}
                            </label>
                            <input id="first_name" v-model="formData.first_name" type="text" required
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400" />
                        </div>
                        <div class="mb-4">
                            <label for="last_name"
                                class="block text-sm font-medium text-gray-700 bg-white px-1 ml-2 -mb-3 z-10 relative w-fit">
                                {{ t('last_name') }}
                            </label>
                            <input id="last_name" v-model="formData.last_name" type="text" required
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400" />
                        </div>
                    </div>

                    <!-- Step 2 -->
                    <div v-if="currentStep === 2">
                        <div class="mb-4">
                            <label for="date_of_birth"
                                class="block text-sm font-medium text-gray-700 bg-white px-1 ml-2 -mb-3 z-10 relative w-fit">
                                Date of Birth
                            </label>
                            <input id="date_of_birth" v-model="formData.date_of_birth" type="date"
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400" />
                        </div>
                        <div class="mb-6">
                            <label class="block text-sm font-semibold text-gray-700 mb-3">Gender</label>
                            <div class="flex items-center space-x-6">
                                <label class="inline-flex items-center cursor-pointer">
                                    <input type="radio" v-model="formData.gender" value="male"
                                        class="form-radio text-sky-400 border-gray-300 rounded-full focus:ring-2 focus:ring-sky-400" />
                                    <span class="ml-2 text-gray-800">Male</span>
                                </label>
                                <label class="inline-flex items-center cursor-pointer">
                                    <input type="radio" v-model="formData.gender" value="female"
                                        class="form-radio text-sky-400 border-gray-300 rounded-full focus:ring-2 focus:ring-sky-400" />
                                    <span class="ml-2 text-gray-800">Female</span>
                                </label>
                            </div>
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
                        </div>
                        <div class="mb-4">
                            <label for="password"
                                class="block text-sm font-medium text-gray-700 bg-white px-1 ml-2 -mb-3 z-10 relative w-fit">
                                {{ t('password') }}
                            </label>
                            <input id="password" v-model="formData.password" type="password" required
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400" />
                        </div>
                        <div class="mb-4">
                            <label for="confirm-password"
                                class="block text-sm font-medium text-gray-700 bg-white px-1 ml-2 -mb-3 z-10 relative w-fit">
                                Confirm Password
                            </label>
                            <input id="confirm-password" v-model="formData.confirm_password" type="password" required
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400" />
                        </div>
                    </div>

                    <!-- Navigation Buttons -->
                    <div class="flex justify-between mt-6">
                        <button v-if="currentStep > 1" @click.prevent="prevStep"
                            class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-sky-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400">
                            Previous
                        </button>
                        <button type="submit"
                            class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-400 hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400">
                            {{ currentStep === 3 ? 'Submit' : 'Next' }}
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
    confirm_password: '', // Add confirm_password
});

// Validation Functions
const isValidStep1 = () => {
    return formData.user_name && formData.first_name && formData.last_name;
};

const isValidStep2 = () => {
    if (!formData.date_of_birth) return false;

    const birthDate = new Date(formData.date_of_birth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const ageAdjustment = today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? -1 : 0;

    return age + ageAdjustment >= 13 && formData.gender;
};

const isValidStep3 = () => {
    return formData.password && formData.password === formData.confirm_password;
};

// Step Navigation
const nextStep = () => {
    if (currentStep.value === 1 && isValidStep1()) {
        currentStep.value++;
    } else if (currentStep.value === 2 && isValidStep2()) {
        currentStep.value++;
    } else if (currentStep.value === 3 && isValidStep3()) {
        handleSubmit();
    } else {
        alert('Please complete all required fields correctly.');
    }
};

const prevStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--;
    }
};

// Form Submission
const handleSubmit = async () => {
    const authStore = useAuthStore();
    const router = useRouter();

    try {
        const success = await authStore.register(formData);
        if (success) {
            router.push('/signin');
        } else {
            alert(authStore.error || 'Registration failed.');
        }
    } catch (err) {
        console.error('Error submitting form:', err);
    }
};
</script>
