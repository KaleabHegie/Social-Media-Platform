import { defineStore } from "pinia";
import MyHttpService from "@/stores/MyHttpService";
import { useToast } from "vue-toastification";

export const useAdminStore = defineStore("adminStore", {
  state: () => ({
    users: [],
    reportedPosts: [],
    postAnalytics: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async getUserDataAdmin(query = "") {
      const toast = useToast();
      this.isLoading = true;
      this.error = null;

      try {
        const response = await MyHttpService.get("/getUserDataAdmin", {
          query: { query },
          useJWT: true,
        });

        if (response.error) {
          this.error = response.error;
          toast.error(this.error); // Display error notification
        } else {
          this.users = Array.isArray(response.users) ? response.users : [];
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        this.error = "An unexpected error occurred.";
        toast.error(this.error); // Handle unknown errors
      } finally {
        this.isLoading = false;
      }
    },

    async deleteAccountAdmin(userId) {
      const toast = useToast();
      this.error = null;
      try {
        const response = await MyHttpService.post("/deleteAccountAdmin", {
          query: { userId: userId },
          useJWT: true,
        });

        if (response.error) {
          toast.error(response.error || "An Error Occured");
          return;
        }
        // Remove the user from the list
        this.users = this.users.filter((user) => user._id !== userId);
        toast.success(response.message || "User Deleted Successfully");
      } catch (err) {
        toast.error("Unexpected Error Occured");
        return;
      }
    },

    async markAsVerifiedAdmin(userId) {
      const toast = useToast();
      this.error = null;
      try {
        const response = await MyHttpService.post("/markAsVerifiedAdmin", {
          query: { userId: userId },
          useJWT: true,
        });

        if (response.error) {
          toast.error(response.error || "An Error Occured");
          return;
        }

        if (response.newStatus !== undefined) {
          const user = this.users.find((user) => user._id === userId);
          if (user) {
            user.is_verified = response.newStatus;
          }
        }
        toast.success(response.message || "User Verfication Changed");
      } catch (err) {
        toast.error("Unexpected Error Occured");
        return;
      }
    },

    async getReportedPosts() {
      const toast = useToast();
      this.isLoading = true;
      this.error = null;

      try {
        const response = await MyHttpService.get("/getReportedPosts", {
          useJWT: true,
        });

        if (response.error) {
          this.error = response.error;
          toast.error(this.error); // Display error notification
        } else {
          this.reportedPosts = Array.isArray(response.posts) ? response.posts : [];
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        this.error = "An unexpected error occurred.";
        toast.error(this.error); // Handle unknown errors
      } finally {
        this.isLoading = false;
      }
    },
    async deleteReportedPost(postId) {
      const toast = useToast();
      this.error = null;
      try {
        const response = await MyHttpService.post("/deleteReportedPost", {
          body: { postId: postId },
          useJWT: true,
        });

        if (response.error) {
          toast.error(response.error || "An Error Occured");
          return;
        }

        console.log("Before:", JSON.stringify(this.reportedPosts, null, 2));
        // Remove the user from the list
        this.reportedPosts = this.reportedPosts.filter(
          (post) => post._id !== postId
        );
        console.log("After", JSON.stringify(this.reportedPosts, null, 2));

        toast.success(response.message || "Post Deleted Successfully");
      } catch (err) {
        toast.error(err);
        return;
      }
    },

    async getPostAnalytics() {
      const toast = useToast();
      this.isLoading = true;
      this.error = null;

      try {
        const response = await MyHttpService.get("/getPostAnalytics", {
          useJWT: true,
        });

        if (response.error) {
          this.error = response.error;
          toast.error(this.error); // Display error notification
        } else {
          // console.log(JSON.stringify(response, null, 2));
          this.postAnalytics = Array.isArray(response.analytics)
            ? response.analytics
            : [];
          // console.log(JSON.stringify(this.postAnalytics, null, 2));
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        this.error = "An unexpected error occurred.";
        toast.error(this.error); // Handle unknown errors
      } finally {
        this.isLoading = false;
      }
    },
  },
});
