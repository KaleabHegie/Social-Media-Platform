import { reactive, computed } from 'vue'

const translations = {
  Username: {
    en: " Username or email",
    am: " የተጠቃሚ ስም ወይም ኢሜይል"
  },
  password: {
    en: "Password",
    am: "የይለፍ ቃል"
  },
  remember: {
    en: "Remember me",
    am: "አስታውሰኝ"
  },
  forgot: {
    en: "Forgot your password?",
    am: "የይለፍ ቃልዎን ረስተዋል?"
  },
  signingin: {
    en: "Signing in...",
    am: "እየገባ ነው..."
  },
  signin: {
    en: "Sign in",
    am: "ግባ"
  },
  noaccount: {
    en: "Don't have an account?",
    am: "አካውንትዎ የለህም?"
  },
  signup: {
    en: "Sign up",
    am: "አዲስ አካውንት ይፍጠሩ"
  },
  emailerror: {
    en: "Email must include an '@' symbol.",
    am: "ኢሜል የ'@' ምልክት ማካተት አለበት።"
  },
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