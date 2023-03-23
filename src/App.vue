<template>

   <input v-model="tiket" />
   <input v-model="fromDate" type="date" />
   <input v-model="toDate" type="date" />

   <LineChart :chartData="prices" :width="900" />
  
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { getHistoryStockQuotes } from './api/moex';

import { DoughnutChart, LineChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);


const tiket = ref('GAZP');
const fromDate = ref('2021-01-01')
const toDate = ref()

const prices = ref({});

watchEffect(async () => {
   const data = await getHistoryStockQuotes(tiket.value, 'TQBR', { fromDate: fromDate.value, toDate: toDate.value });
   prices.value = {
      labels: data.map((item:any) => item.date),
      datasets: [
         {
            data: data.map((item: any) => item.volume)
         }
      ]
   }
})



</script>
