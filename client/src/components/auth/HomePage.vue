<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <nav class="container mx-auto px-6 py-3">
        <div class="flex justify-between items-center">
          <div class="text-xl font-semibold text-gray-700">{{ t('welcome') }}</div>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-600 hover:text-gray-900">{{ t('about') }}</a>
            <a href="#" class="text-gray-600 hover:text-gray-900">{{ t('services') }}</a>
            <a href="#" class="text-gray-600 hover:text-gray-900">{{ t('contact') }}</a>
            <button @click="switchLanguage" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
              {{ currentLanguage === 'en' ? 'አማርኛ' : 'English' }}
            </button>
          </div>
        </div>
      </nav>
    </header>

    <main class="container mx-auto px-6 py-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">{{ t('welcome') }}</h1>
      <p class="text-xl text-gray-600 mb-8">{{ t('description') }}</p>
      <a href="#" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold">
        {{ t('learnMore') }}
      </a>
    </main>
  </div>
</template>

<script setup>
import { useLanguageStore } from '@/stores/languageStore'

const { currentLanguage, switchLanguage, t } = useLanguageStore()
</script>