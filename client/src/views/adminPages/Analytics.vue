<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold text-sky-800">Content Analytics</h1>
    <div class="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-10">
        <p class="text-sky-600">Loading data...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="text-center py-10">
        <p class="text-red-600 font-semibold">Error: {{ error }}</p>
      </div>

      <!-- Chart Display -->
      <div v-else>
        <canvas id="postAnalyticsChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAdminStore } from "@/stores/adminStore";
import Chart from "chart.js/auto";

// AdminStore
const adminStore = useAdminStore();

// Reactive Bindings
const postAnalytics = computed(() => adminStore.postAnalytics);
const isLoading = computed(() => adminStore.isLoading);
const error = computed(() => adminStore.error);

// Chart Instance
let chartInstance = null;

// Fetch Data on Mount and Render Chart
onMounted(() => {
  adminStore.getPostAnalytics().then(() => {
    if (!error.value && postAnalytics.value.length > 0) {
      renderChart();
    }
  });
});

// Render Chart
function renderChart() {
  const ctx = document.getElementById("postAnalyticsChart").getContext("2d");

  // Destroy existing chart instance to prevent duplicates
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Prepare data for the chart
  const labels = postAnalytics.value.map((item) => item.date);
  const postsData = postAnalytics.value.map((item) => item.posts);
  const storiesData = postAnalytics.value.map((item) => item.stories);

  // Create new chart instance
  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Posts",
          data: postsData,
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          fill: true,
        },
        {
          label: "Stories",
          data: storiesData,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Post and Story Analytics",
        },
      },
    },
  });
}
</script>
