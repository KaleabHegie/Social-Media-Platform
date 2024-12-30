import { reactive, computed } from 'vue'

const translations = {
  Username: {
    en: " Username or email",
    am: " የተጠቃሚ ስም ወይም ኢሜይል"
  },
  about: {
    en: "About Us",
    am: "ስለ እኛ"
  },
  services: {
    en: "Our Services",
    am: "አገልግሎቶቻችን"
  },
  contact: {
    en: "Contact Us",
    am: "ያግኙን"
  },
  description: {
    en: "We provide high-quality services to meet your needs.",
    am: "ፍላጎትዎን ለማሟላት ጥራት ያለው አገልግሎት እንሰጣለን።"
  },
  learnMore: {
    en: "Learn More",
    am: "ተጨማሪ ይወቁ"
  }
}

export const useLanguageStore = () => {
  const state = reactive({
    currentLanguage: 'en'
  })

  const switchLanguage = () => {
    state.currentLanguage = state.currentLanguage === 'en' ? 'am' : 'en'
  }

  const t = computed(() => (key) => translations[key][state.currentLanguage])

  return {
    currentLanguage: computed(() => state.currentLanguage),
    switchLanguage,
    t
  }
}