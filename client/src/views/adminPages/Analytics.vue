<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-10">
    <h1 class="text-3xl font-bold text-sky-800 mb-8">Content Analytics</h1>
    <div class="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
      <LineChart v-if="chartData" :chart-data="chartData" :options="chartOptions" class="h-96" />
      <p v-else class="text-center text-gray-500">Loading chart...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Line as LineChart } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

// Ensure `chartData` is initialized to prevent errors
const analyticsData = ref([
  { date: '2025-01-15', type: 'post', count: 25 },
  { date: '2025-01-15', type: 'story', count: 15 },
  { date: '2025-01-16', type: 'post', count: 30 },
  { date: '2025-01-16', type: 'story', count: 20 },
  { date: '2025-01-17', type: 'post', count: 40 },
]);

const chartData = ref(null);

onMounted(() => {
  const dates = [...new Set(analyticsData.value.map((item) => item.date))];
  const postData = dates.map((date) =>
    analyticsData.value.find((item) => item.date === date && item.type === 'post')?.count || 0
  );
  const storyData = dates.map((date) =>
    analyticsData.value.find((item) => item.date === date && item.type === 'story')?.count || 0
  );

  chartData.value = {
    labels: dates,
    datasets: [
      {
        label: 'Posts',
        data: postData,
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Stories',
        data: storyData,
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.2)',
        tension: 0.3,
      },
    ],
  };
});

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Count',
      },
    },
    x: {
      title: {
        display: true,
        text: 'Date',
      },
    },
  },
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Posts vs Stories',
    },
  },
};
</script>
