<template>
  <button
    @click="toggleDarkMode"
    @keydown.space.prevent="toggleDarkMode"
    class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-400"
    :class="isDarkMode ? 'bg-gray-700' : 'bg-sky-100'"
    role="switch"
    :aria-checked="isDarkMode"
    aria-label="Toggle dark mode"
  >
    <span
      class="inline-block w-4 h-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out"
      :class="isDarkMode ? 'translate-x-6' : 'translate-x-1'"
    >
      <SunIcon v-if="!isDarkMode" class="h-4 w-4 text-yellow-500" />
      <MoonIcon v-else class="h-4 w-4 text-blue-500" />
    </span>
  </button>
</template>

<script setup>
import { ref, watch } from 'vue'
import { SunIcon, MoonIcon } from 'lucide-vue-next'

const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  updateTheme()
}

const updateTheme = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Initialize theme based on system preference
isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
updateTheme()

// Watch for system preference changes
watch(
  () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  (isDark) => {
    isDarkMode.value = isDark
    updateTheme()
  }
)
</script>