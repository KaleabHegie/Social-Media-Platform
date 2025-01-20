// stores/languageStore.js
import { defineStore } from "pinia";
import { ref, computed, onMounted } from "vue";

const translations = {
  currentLanguage: "en",

  Username: {
    en: " Username or Email",
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
    en: "Male",
    am: "ወንድ",
  },
  female: {
    en: "Female",
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
  home: {
    en: "Home",
    am: "ዋና ገጽ",
  },
  explore: {
    en: "Explore",
    am: "አሳሽ ገጽ",
  },
  createPost: {
    en: "Create Post",
    am: "ፖስት ይፍጠሩ",
  },
  message: {
    en: "Messages",
    am: "መልክት",
  },
  account: {
    en: "Account",
    am: "መለያ",
  },
  feed: {
    en: "Feed",
    am: "መግለጫ",
  },
  stories: {
    en: "Stories",
    am: "ታሪኮች",
  },
  readMore: {
    en: "Read More",
    am: "ተጨማሪ አንብብ",
  },
  readLess: {
    en: "Read Less",
    am: "ያነሰ አንብብ",
  },
  create: {
    en: "Create New Post",
    am: "አዲስ ለጥፍ",
  },
  post: {
    en: "Post",
    am: "ለጥፍ",
  },
  story: {
    en: "Story",
    am: "ታሪክ",
  },
  uploadMedia: {
    en: "Upload Media (up to 4 media)",
    am: "ሚዲያ ስቀል (እስከ 4 ሚዲያ)",
  },
  upload: {
    en: "Upload",
    am: "ስቀል",
  },
  camera: {
    en: "Camera",
    am: "ካሜራ",
  },
  caption: {
    en: "Caption",
    am: "መግለጫ ጽሑፍ",
  },
  hashtag: {
    en: "Hashtag",
    am: "ሃሽታግ",
  },
  submitPost: {
    en: "Submit Post",
    am: "ልጥፍ አስገባ",
  },
  all: {
    en: "All",
    am: "ሁሉም",
  },
  personal: {
    en: "Personal",
    am: "ግልጽ",
  },
  group: {
    en: "Group",
    am: "ቡድን",
  },
  Noprofile: {
    en: "No Profile",
    am: "ምንም መረጃ የለም",
  },
  language: {
    en: "Language",
    am: "ቋንቋ",
  },
  theme: {
    en: "Theme",
    am: "ትም",
  },
  delete: {
    en: "Delete Account",
    am: "ሰርዝ መለያ",
  },
  Logout: {
    en: "Logout",
    am: "ውጣ",
  },
  switchPublic: {
    en: "Switch to Public",
    am: "ወደ ሰርተው ቀላል",
  },
  switchPrivate: {
    en: "Switch to Private",
    am: "ወደ ግልጽ ቀላል",
  },
  followers: {
    en: "Followers",
    am: "ተከታዮች",
  },
  following: {
    en: "Following",
    am: "መከታተያ",
  },
  updateBio: {
    en: "Update Bio",
    am: "ባዮ አስተካክል",
  },
  noPosts: {
    en: "No posts available",
    am: "ምንም ለጥፍ የለም",
  },
  noLiked: {
    en: "No liked posts available",
    am: "ምንም ተወዳጆች የለም",
  },
  nofollowing: {
    en: "No following yet",
    am: "ምንም መከታተያ የለም",
  },
  nofollowers: {
    en: "No followers yet",
    am: "ምንም ተከታዮች የለም",
  },
  tabsposts: {
    en: "Posts",
    am: "ልጥፍዎች",
  },
  tabsliked: {
    en: "Liked",
    am: "ተወዳጆች",
  },
  tabsfollowing: {
    en: "Following",
    am: "መከታተያ",
  },
  tabsfollowers: {
    en: "Followers",
    am: "ተከታዮች",
  },
  loadingPosts: {
    en: "Loading stories and posts...",
    am: "ለጥፍ በመጫን ላይ...",
  },
  loadProfile: {
    en: "Loading profile...",
    am: "መለያ በመጫን ላይ...",
  },
  usernameLong: {
    en: "Username must be at least 3 characters long.",
    am: "የተጠቃሚ ስም በጣም 3 ፊደላት ርቀት አድርገዋል።",
  },
  emailDomain: {
    en: "Email must include a valid domain (e.g., '.com').",
    am: "ኢሜይል የተሳሳተ አድራሻ ነው (ለማለፍ፣ '.com')።",
  },
  usernameTaken: {
    en: "Username is already taken.",
    am: "የተጠቃሚ ስም ተወስዶዋል።",
  },
  agerequire: {
    en: "You must be at least 13 years old.",
    am: "ከ13 አመት በላይ መሆን አለበት።",
  },
  weak: {
    en: "Password is weak",
    am: "የይለፍ ቃል ደካማ ነው",
  },
  moderate: {
    en: "Password is moderate",
    am: "የይለፍ ቃል ተመን ነው",
  },
  strong: {
    en: "Password is strong",
    am: "የይለፍ ቃል ጠንካራ ነው",
  },
  short: {
    en: "Password is too short",
    am: "የይለፍ ቃል አጭር ነው",
  },
  match:{
    en: "Passwords do not match",
    am: "የይለፍ ቃልዎ አንዳይነት አይደለም",
  },
  emailTaken: {
    en: "Email is already taken.",
    am: "ኢሜይል ተወስዶዋል።",
  },
  notifiy: {
    en: "Notifications",
    am: "ማሳወቂያ",
  },
  dismiss:{
    en: "Dismiss All",
    am: "አትፋ ሁሉንም",
  },
  users:{
    en: "Users",
    am: "ተጠቃሚዎች",
  },
  follow:{
    en: "Follow",
    am: "ተከተል",
  },
  unfollow:{
    en: "Unfollow",
    am: "አትከታተል",
  },
  comment:{
    en: "Comment",
    am: "አስተያየት",
  },
  addComment:{
    en: "Add a comment...",
    am: "አስተያየት ይስጡ...",
  },
  searchPosts:{
    en:"Search posts or users...",
    am:"ለጥፍ ወይም ተጠቃሚዎች ይፈልጉ...",
  },
  writeCaption:{
    en:"Write a caption...",
    am:"መግለጫ ይፃፉ...",
  },
  addHashtag:{
    en:"Add a hashtag...",
    am:"ሃሽታግ ይጨምሩ..."
  },
};

export const useLanguageStore = defineStore("language", () => {
  // Try to get the language from localStorage, default to 'en'
  const currentLanguage = ref(localStorage.getItem("language") || "en");

  // Function to switch between languages
  const switchLanguage = () => {
    currentLanguage.value = currentLanguage.value === "en" ? "am" : "en";
    // Set the language in localStorage whenever it's switched
    localStorage.setItem("language", currentLanguage.value);
    console.log(currentLanguage.value);
  };

  // Computed property to get the translation for a key
  const t = computed(
    () => (key) => translations[key]?.[currentLanguage.value] || key
  );

  // On mounted, check for any saved language in localStorage
  onMounted(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      currentLanguage.value = savedLanguage;
    }
  });

  return {
    currentLanguage,
    switchLanguage,
    t,
    translations, // Returning the translations object as well
  };
});
