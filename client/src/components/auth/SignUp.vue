<template>
    <div
        class=" min-h-screen bg-white rounded-lg shadow-xl overflow-hidden flex items-center justify-center py-12 sm:px-6 lg:px-8">
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

                <div class="mb-6">
                    <div class="flex justify-between mb-2">
                        <span
                            class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-sky-400 bg-blue-200">
                            Step {{ currentStep }} of 3
                        </span>
                    </div>
                    <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                        <div :style="{ width: `${(currentStep / 3) * 100}%` }"
                            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500">
                        </div>
                    </div>
                </div>

                <form @submit.prevent="nextStep">
                    <div v-if="currentStep === 1">
                        <div class="mb-4">
                            <label for="user_name"
                                class="block text-sm font-medium text-gray-700 bg-white px-1 ml-2 -mb-3 z-10 relative w-fit">
                                Username
                            </label>
                            <input id="user_name" v-model="formData.user_name" type="text" required
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div class="mb-4">
                            <label for="first_name"
                                class="block text-sm font-medium text-gray-700 bg-white px-1 ml-2 -mb-3 z-10 relative w-fit">
                                First Name
                            </label>
                            <input id="first_name" v-model="formData.first_name" type="text" required
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div class="mb-4">
                            <label for="last_name"
                                class="block text-sm font-medium text-gray-700 bg-white px-1 ml-2 -mb-3 z-10 relative w-fit">
                                Last Name
                            </label>
                            <input id="last_name" v-model="formData.last_name" type="text" required
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>

                    <div v-if="currentStep === 2">
                        <div class="mb-4">
                            <label for="date_of_birth"
                                class="block text-sm font-medium text-gray-700 bg-white px-1 ml-2 -mb-3 z-10 relative w-fit">
                                Date of Birth
                            </label>
                            <input id="date_of_birth" v-model="formData.date_of_birth" type="date"
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div class="mb-6">
                            <label class="block text-sm font-semibold text-gray-700 mb-3">Gender</label>
                            <div class="flex items-center space-x-6">
                                <label class="inline-flex items-center cursor-pointer">
                                    <input type="radio" v-model="formData.gender" value="male"
                                        class="form-radio text-sky-400 border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500" />
                                    <span class="ml-2 text-gray-800">Male</span>
                                </label>
                                <label class="inline-flex items-center cursor-pointer">
                                    <input type="radio" v-model="formData.gender" value="female"
                                        class="form-radio text-sky-400 border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500" />
                                    <span class="ml-2 text-gray-800">Female</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div v-if="currentStep === 3">
                        <div class="mb-4">
                            <label for="email"
                                class="block text-sm font-medium text-gray-700 bg-white px-1 ml-2 -mb-3 z-10 relative w-fit">
                                Email
                            </label>
                            <input id="email" v-model="formData.email" type="email" required
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div class="mb-4">
                            <label for="password"
                                class="block text-sm font-medium text-gray-700 bg-white px-1 ml-2 -mb-3 z-10 relative w-fit">
                                Password
                            </label>
                            <input id="password" v-model="formData.password" type="password" required
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>

                    <div class="flex justify-between mt-6">
                        <button v-if="currentStep > 1" @click.prevent="prevStep"
                            class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-sky-400 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Previous
                        </button>
                        <button type="submit"
                            class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-400 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            {{ currentStep === 3 ? 'Submit' : 'Next' }}
                        </button>
                    </div>
                </form>

                <div class="mt-4 text-center">
                    <p class="text-sm text-gray-600">
                        Already have an account?
                        <a href="#" @click.prevent="$emit('switch-to-login')"
                            class="font-medium text-sky-400 hover:text-blue-500">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const currentStep = ref(1)
const formData = reactive({
    user_name: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    email: '',
    password: ''
})

const nextStep = () => {
    if (currentStep.value < 3) {
        currentStep.value++
    } else {
        // Handle form submission
        console.log('Form submitted:', formData)
        // You would typically send this data to your backend here
    }
}

const prevStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--
    }
}
</script>