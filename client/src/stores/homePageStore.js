import { defineStore } from 'pinia';
import MyHttpService from '@/stores/MyHttpService';
import Explore from '../views/userPages/Explore.vue';

export const usePostStoryStore = defineStore('postStory', {
  state: () => ({
    posts: [],
    stories: [],
    explore : [],
    myProfile : [],
    isLoading: false,
    error: null,
  }),

  getters: {
    hasPosts: (state) => state.posts.length > 0,
    hasStories: (state) => state.stories.length > 0,
  },

  actions: {
    async fetchPosts() {
      this.isLoading = true;
      this.error = null;
      try {
        console.log("Fetching posts...");
        const response = await MyHttpService.get('/getHomeFeed', { useJWT: true });
        console.log("Posts Response:", response);
        this.posts = Array.isArray(response.posts) ? response.posts : [];
      } catch (error) {
        console.error("Error fetching posts:", error.response || error.message);
        this.error = error.response?.message || 'Failed to fetch posts.';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchStories() {
      this.isLoading = true;
      this.error = null;
      try {
        console.log("Fetching stories...");
        const response = await MyHttpService.get('/getStories', { useJWT: true });
        console.log("Stories Response:", response);
        this.stories = Array.isArray(response.stories) ? response.stories : [];
      } catch (error) {
        console.error("Error fetching stories:", error.response || error.message);
        this.error = error.response?.message || 'Failed to fetch stories.';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchExplore() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await MyHttpService.get("/getExploreFeed" , {useJWT: true});
        this.posts = Array.isArray(response.posts) ? response.posts : [];
      } catch (error) {
        this.error = error.response?.message || "Story Fetch failed";
        return false;
      } finally {
        this.isLoading = false;
      }
    }, 

    
    async createPost(content) {
      
      const formData = new FormData();
    
      // Append non-file fields to FormData
      if (content.type) formData.append("type", content.type);
      if (content.caption) formData.append("caption", content.caption);
      if (content.hashtags) formData.append("hashtags", content.hashtags);
    
      // Append the media files (assuming content.media is an array of files)
      if (content.media && Array.isArray(content.media)) {
        content.media.forEach(file => {
          formData.append("files", file); // Change "media" to "files"
        });
      }

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      
      this.isLoading = true;
      this.error = null;
      try {
        console.log("Creating post...");
        
        // Don't manually set 'Content-Type' since FormData will set it correctly
        const response = await MyHttpService.post('/uploadPost', { body: formData, useJWT: true });
        console.log("Post created successfully:", formData);
      } catch (error) {
        console.error("Error creating post:", error.response || error.message);
        this.error = error.response?.message || 'Failed to create post.';
      } finally {
        this.isLoading = false;
      }
    },    

    async fetchUserProfile() {
      this.isLoading = true;
      this.error = null;
      try {
        console.log("Fetching user profile...");
        const response = await MyHttpService.get('/getMyUserProfile', { useJWT: true });
        console.log("User Profile Response:", response);
        
        if (response.profile) {
          this.myProfile = response.profile;       // Store the profile data
          this.myPosts = response.myposts || [];      // Store the user's posts
          this.likedPosts = response.likedPosts || []; // Store the liked posts
        }
      } catch (error) {
        this.error = error.response?.message || 'Failed to fetch profile.';
      } finally {
        this.isLoading = false;
      }
    },

    clearData() {
      this.posts = [];
      this.stories = [];
      this.error = null;
    },
  },
});
