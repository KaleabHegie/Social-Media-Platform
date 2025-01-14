import { defineStore } from "pinia";
import MyHttpService from "@/stores/MyHttpService";
import Explore from "../views/userPages/Explore.vue";

export const usePostStoryStore = defineStore("postStory", {
  state: () => ({
    posts: [],
    stories: [],
    explore: [],
    myProfile: [],
    myPosts: [],
    likedPosts: [],
    allUsers: [],
    messages: [],
    currentUser: [],
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
        const response = await MyHttpService.get("/getHomeFeed", { useJWT: true });
        this.posts = Array.isArray(response.posts) ? response.posts : [];
      } catch (error) {
        this.error = error.response?.message || "Failed to fetch posts.";
      } finally {
        this.isLoading = false;
      }
    },

    async getPostById(postId) {
      const post = this.posts.find((post) => post._id === postId) || null;
      return post;
    },

    getStoryById(postId) {
      return this.posts.find((post) => post._id === postId) || null;
    },

    async fetchStories() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MyHttpService.get("/getStories", { useJWT: true });
        this.stories = Array.isArray(response.stories) ? response.stories : [];
      } catch (error) {
        this.error = error.response?.message || "Failed to fetch stories.";
      } finally {
        this.isLoading = false;
      }
    },

    async fetchExplore(hashtag = "") {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await MyHttpService.get("/getExploreFeed", {
          query: { hashtag: hashtag },
          useJWT: true,
        });
        this.explore = Array.isArray(response.posts) ? response.posts : [];
        console.log(this.explore);
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
        content.media.forEach((file) => {
          formData.append("files", file); // Change "media" to "files"
        });
      }

      this.isLoading = true;
      this.error = null;
      try {
        // Don't manually set 'Content-Type' since FormData will set it correctly
        const response = await MyHttpService.post("/uploadPost", {
          body: formData,
          useJWT: true,
        });
        return response;
      } catch (error) {
        this.error = error.response?.message || "Failed to create post.";
      } finally {
        this.isLoading = false;
      }
    },

    async addComment(content) {
      this.isLoading = true;
      this.error = null;
      try {
        // Don't manually set 'Content-Type' since FormData will set it correctly
        const response = await MyHttpService.post("/makeComment", {
          body: content,
          useJWT: true,
        });
        return response;
      } catch (error) {
        this.error = error.response?.message || "Failed to create post.";
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUserProfile() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MyHttpService.get("/getMyUserProfile", { useJWT: true });
        if (response.profile) {
          this.myProfile = response.profile;
          this.myPosts = response.myposts || []; // Store the user's posts
          this.likedPosts = response.likedPosts || []; // Store the liked posts
        }
      } catch (error) {
        this.error = error.response?.message || "Failed to fetch profile.";
      } finally {
        this.isLoading = false;
      }
    },

    async fetchOtherUserProfile(user_id) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MyHttpService.get("/getUserProfile", {
          query: { user_id: user_id },
          useJWT: true,
        });
        if (response.profile) {
          this.myProfile = response.profile; // Store the profile data
          this.usersposts = response.usersposts || []; // Store the user's posts
          this.likedPosts = response.likedPosts || []; // Store the liked posts
        }
      } catch (error) {
        this.error = error.response?.message || "Failed to fetch profile.";
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAllUsers() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MyHttpService.get("/getAllUsers", { useJWT: true });
        if (response.allUsers) {
          this.allUsers = response.allUsers;
        }
      } catch (error) {
        this.error = error.response?.message || "Failed to fetch profile.";
      } finally {
        this.isLoading = false;
      }
    },

    async fetchMessages(selectedUserId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MyHttpService.get("/fetchMessages", {
          query: { selectedUserId: selectedUserId },
          useJWT: true,
        });
        if (response.messages) {
          this.messages = response.messages[0].messages;
        }
      } catch (error) {
        this.error = error.response?.message || "Failed to fetch profile.";
      } finally {
        this.isLoading = false;
      }
    },

    async updateBio(bio) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MyHttpService.post("/setBio", {
          body: { bio: bio },
          useJWT: true,
        });
      } catch (error) {
        this.error = error.response?.message || "Failed to update bio.";
      } finally {
        this.isLoading = false;
      }
    },

    async updateAccountType(type) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MyHttpService.post("/setAccountVisibility", {
          body: { type: type },
          useJWT: true,
        });
      } catch (error) {
        this.error = error.response?.message || "Failed to update account.";
      } finally {
        this.isLoading = false;
      }
    },

    async updateProfilePhoto(file) {
      this.isLoading = true;
      this.error = null;
      try {
        const formData = new FormData();
        formData.append("profileImg", file);
        const response = await MyHttpService.post("/setProfileImage", {
          body: formData,
          useJWT: true,
        });
      } catch (error) {
        this.error = error.response?.message || "Failed to update profile picture.";
      } finally {
        this.isLoading = false;
      }
    },

    async likeDislike(postId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MyHttpService.post("/likePost", {
          body: { postId: postId },
          useJWT: true,
        });
        if (response.messages) {
          this.messages = response.messages[0].messages;
        }
      } catch (error) {
        this.error = error.response?.message || "Failed to fetch profile.";
      } finally {
        this.isLoading = false;
      }
    },

    async followUser(userId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MyHttpService.post("/followUser", {
          body: { userId: userId },
          useJWT: true,
        });
        if (response.messages) {
          this.messages = response.messages[0].messages;
        }
      } catch (error) {
        this.error = error.response?.message || "Failed to fetch profile.";
      } finally {
        this.isLoading = false;
      }
    },

    async deleteAccount() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MyHttpService.post("/deleteAccount", { useJWT: true });
        if (response.messages) {
          this.messages = response.messages[0].messages;
        }
      } catch (error) {
        this.error = error.response?.message || "Failed to fetch profile.";
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
