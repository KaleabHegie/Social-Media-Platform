// stores/languageStore.js
import { defineStore } from "pinia";
import { computed, reactive,ref } from "vue";

const translations = {
  currentLanguage: "en",

  Username: {
    en: " Username or email",
    am: " የተጠቃሚ ስም ወይም ኢሜይል",
  },
  email: {
    en: "Email",
    am: "ኢሜይል",
  },
  usernameonly: {
    en: " Username",
    am: " የተጠቃሚ ስም",
  },
  first_name: {
    en: " First Name",
    am: " የመጀመሪያ ስም",
  },
  last_name: {
    en: " Last Name",
    am: " የአባት ስም",
  },
  password: {
    en: "Password",
    am: "የይለፍ ቃል",
  },
  remember: {
    en: "Remember me",
    am: "አስታውሰኝ",
  },
  forgot: {
    en: "Forgot your password?",
    am: "የይለፍ ቃልዎን ረስተዋል?",
  },
  confirmpass: {
    en: "Confirm Password",
    am: "የይለፍ ቃል አረጋግጥ",
  },
  signingin: {
    en: "Signing in...",
    am: "እየገባ ነው...",
  },
  signin: {
    en: "Sign in",
    am: "ግባ",
  },
  noaccount: {
    en: "Don't have an account?",
    am: "አካውንትዎ የለህም?",
  },
  signup: {
    en: "Sign up",
    am: "አዲስ አካውንት ይፍጠሩ",
  },
  haveaccount: {
    en: "Already have an account?",
    am: "መለያ አለህ?",
  },
  emailerror: {
    en: "Email must include an '@' symbol.",
    am: "ኢሜል የ'@' ምልክት ማካተት አለበት።",
  },
  reset: {
    en: "Reset Password",
    am: "የይለፍ ቃልዎን ያስታውሱ",
  },
  or: {
    en: "or",
    am: "ወይም",
  },
  return: {
    en: "Return to Sign in",
    am: "ተመለስ",
  },
  send: {
    en: "Send reset instructions",
    am: "የይለፍ ቃልዎን ለማስታወስ ይህን ይንኩ",
  },
  resetSent: {
    en: "Reset instructions sent",
    am: "የይለፍ ቃልዎን ለማስታወስ ተሳክቷል",
  },
  instructions: {
    en: "Check your email for instructions on how to reset your password.",
    am: "የይለፍ ቃልዎን ለማስታወስ የኢሜይልዎን ለመረዳት ይህን ይንኩ",
  },
  process: {
    en: "Processing...",
    am: "እየገባ ነው...",
  },
  invalid_email: {
    en: "Invalid email",
    am: "ኢሜይል የተሳሳተ ነው",
  },
  next: {
    en: "Next",
    am: "ቀጣይ",
  },
  previous: {
    en: "Previous",
    am: "ወደኋላ",
  },
  submit: {
    en: "Submit",
    am: "አስገባ",
  },
  step: {
    en: "Step",
    am: "ደረጃ",
  },
  of: {
    en: "of",
    am: "ከ",
  },
  dateOfBirth: {
    en: "Date of Birth",
    am: "የልደት ቀን",
  },
  gender: {
    en: "Gender",
    am: "ጾታ",
  },
  male: {
    en: "male",
    am: "ወንድ",
  },
  female: {
    en: "female",
    am: "ሴት",
  },
  username_required: {
    en: "Username is required",
    am: "የተጠቃሚ ስም አስፈላጊ ነው",
  },
  first_name_required: {
    en: "First name is required",
    am: "መጀመሪያ ስም አስፈላጊ ነው",
  },
  last_name_required: {
    en: "Last name is required",
    am: "አባት ስም አስፈላጊ ነው",
  },
  home:{
    en: "Home",
    am: "ዋና ገጽ"
  },
  explore:{
    en: "Explore",
    am:"አሳሽ ገጽ"
  },
  createPost:{
    en: "Create Post",
    am: "ፖስት ይፍጠሩ"
  },
  message:{
    en: "Messages",
    am: "መልክት"
  },
  account:{
    en: "Account",
    am: "መለያ"
  },
  feed:{
    en: "Feed",
    am: "መግለጫ"
  },
  stories:{
    en:"Stories",
    am:"ታሪኮች"
  },
  readMore:{
    en:"Read More",
    am:"ተጨማሪ አንብብ"
  },
  readLess:{
    en:"Read Less",
    am:"ያነሰ አንብብ"
  },
};



export const useLanguageStore = defineStore('language', () => {
  const currentLanguage = ref('en');

  // Function to switch between languages
  const switchLanguage = () => {
    currentLanguage.value = currentLanguage.value === 'en' ? 'am' : 'en';
    console.log(currentLanguage.value);
  };

  // Computed property to get the translation for a key
  const t = computed(() => (key) => translations[key]?.[currentLanguage.value] || key);

  return {
    currentLanguage,
    switchLanguage,
    t,
  };
});

