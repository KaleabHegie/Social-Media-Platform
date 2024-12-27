<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:w-full sm:max-w-md">
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <!-- Logo Section -->
                <div class="text-center">
                    <img class="mx-auto h-16 w-auto" src="@/assets/logo.png" alt="Tsede Logo" />
                    <h2 class="mt-4 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                    <p class="mt-2 text-sm text-gray-600">
                        Or
                        <router-link to="/signup" class="font-medium text-sky-400 hover:text-sky-500">
                            create a new account
                        </router-link>
                    </p>
                </div>

                <!-- Form Section -->
                <form class="space-y-6 mt-6" @submit.prevent="handleSubmit">
                    <!-- Username or Email -->
                    <div>
                        <label for="username" class="block text-sm font-medium text-gray-700">
                            Username or email
                        </label>
                        <div class="mt-1">
                            <input id="username" v-model="form.username" type="text" required
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                :class="{ 'border-red-500': errors.username }" />
                        </div>
                    </div>

                    <!-- Password -->
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div class="mt-1">
                            <input id="password" v-model="form.password" type="password" required
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                :class="{ 'border-red-500': errors.password }" />
                        </div>
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
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SignIn',
    data() {
        return {
            form: {
                username: '',
                password: '',
                rememberMe: false,
            },
            errors: {},
            loading: false,
        }
    },
    methods: {
        validateForm() {
            this.errors = {}
            return true
        },
        async handleSubmit() {
            if (!this.validateForm()) return

            this.loading = true
            try {
                // Add your API call here
                await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
                this.$router.push('/dashboard')
            } catch (error) {
                console.error('Login error:', error)
            } finally {
                this.loading = false
            }
        },
    },
}
</script>