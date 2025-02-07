import { defineStore } from "pinia";
import MyHttpService from "@/stores/MyHttpService";
import Explore from "../views/userPages/Explore.vue";
import ToastService from "../utils/toast.js";

const toast = ToastService();

export const usePostStoryStore = defineStore("postStory", {
  state: () => ({
    posts: [],
    stories: [],
    explore: [],
    searchedUsers: [],
    myProfile: [],
    otherProfile: [],
    myPosts: [],
    likedPosts: [],
    allUsers: [],
    allGroups: [],
    allPublicUsers: [],
    messages: [],
    currentUser: [],
    chats: [],
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

    async getSinglePost(postId) {
      try {
        const response = await MyHttpService.get("/getSinglePost", {
          useJWT: true,
          query: { postId: postId },
        });

        return response;
      } catch (error) {
        return { error: "Failed to fetch post." };
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
      } catch (error) {
        this.error = error.response?.message || "Story Fetch failed";
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async searchUsers(query = "") {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await MyHttpService.get("/searchUsers", {
          query: { query: query },
          useJWT: true,
        });
        this.searchedUsers = Array.isArray(response.users) ? response.users : [];
      } catch (error) {
        this.error = error.response?.message || "Users Fetch failed";
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
      if (content.rawHashtags) formData.append("rawHashtags", content.rawHashtags);

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

    async createGroup(data) {
      this.isLoading = true;
      this.error = null;
      try {
        console.log(data);
        // Don't manually set 'Content-Type' since FormData will set it correctly
        const response = await MyHttpService.post("/createGroup", {
          body: data,
          useJWT: true,
        });
        return response;
      } catch (error) {
        this.error = error.response?.message || "Failed to create Group.";
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
          console.log(response.likedPosts);
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
          this.otherProfile = response.profile; // Store the profile data
          this.usersposts = response.usersposts || []; // Store the user's posts
          this.likedPosts = response.likedPosts || []; // Store the liked posts
        }
      } catch (error) {
        this.error = error.response?.message || "Failed to fetch profile.";
      } finally {
        this.isLoading = false;
      }
    },

    async getAllUsersChattedWith() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MyHttpService.get("/getAllUsersChattedWith", {
          useJWT: true,
        });
        if (response.allUsers) {
          this.allUsers = response.allUsers;
        }
      } catch (error) {
        this.error = error.response?.message || "Failed to fetch profile.";
      } finally {
        this.isLoading = false;
      }
    },

    async getMyGroups() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MyHttpService.get("/getGroups", {
          useJWT: true,
        });
        if (response.allGroups) {
          this.allGroups = response.allGroups;
        }
      } catch (error) {
        this.error = error.response?.message || "Failed to fetch profile.";
      } finally {
        this.isLoading = false;
      }
    },

    async getAllPublicUsers() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MyHttpService.get("/getAllPublicUsers", {
          useJWT: true,
        });
        if (response.allUsers) {
          this.allPublicUsers = response.allUsers;
        }
      } catch (error) {
        this.error = error.response?.message || "Failed to fetch profile.";
      } finally {
        this.isLoading = false;
      }
    },

    async fetchChats() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MyHttpService.get("/getChats", { useJWT: true });
        if (response.allUsers) {
          this.chats = response.allUsers;
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
        console.log(response);
        if (response.messages) {
          this.messages = [];
          this.messages = response.messages[0].messages;
        }
      } catch (error) {
        this.error = error.response?.message || "Failed to fetch profile.";
      } finally {
        this.isLoading = false;
      }
    },

    async fetchMessagesGroup(selectedGroupId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MyHttpService.get("/fetchMessagesGroup", {
          query: { selectedGroupId: selectedGroupId },
          useJWT: true,
        });
        console.log(response);
        if (response.messages) {
          this.messages = [];
          this.messages = response.messages.messages;
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
      // this.isLoading = true;
      // this.error = null;
      try {
        const response = await MyHttpService.post("/likePost", {
          body: { postId: postId },
          useJWT: true,
        });
        if (response.messages) {
          this.messages = response.messages[0].messages;
        }
      } catch (error) {
        ToastService;
        this.error = error.response?.message || "Failed to fetch profile.";
      } finally {
        // this.isLoading = false;
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
        return response;
      } catch (error) {
        return { error: "An Error Occured" };
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

    async deletePost(postId) {
      try {
        const response = await MyHttpService.post("/deletePost", {
          query: { postId: postId },
          useJWT: true,
        });

        if (!response.error) {
          this.posts = this.posts.filter((post) => post._id !== postId);
        }

        return response;
      } catch (error) {
        return { error: "Unable to Delete Post" };
      }
    },
    async markAllAsRead() {
      try {
        const response = await MyHttpService.post("/dismissNotifications", {
          useJWT: true,
        });
        return response;
      } catch (error) {
        return { error: "Failed to Get Notifications." };
      }
    },

    async getNotifications() {
      try {
        const response = await MyHttpService.get("/getNotifications", {
          useJWT: true,
        });
        return response;
      } catch (error) {
        return { error: "Failed to Get Notifications." };
      }
    },

    async reportPost(content) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MyHttpService.post("/reportPost", {
          body: { content: content },
          useJWT: true,
        });

        console.log(response);
        return response;
      } catch (error) {
        return { error: "Failed to Report Post." };
      }
    },

    async acceptRequest(requestId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MyHttpService.post("/acceptRequest", {
          body: { requestId: requestId },
          useJWT: true,
        });
        console.log(response);
      } catch (error) {
        this.error = error.response?.message || "Failed to accept request";
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
