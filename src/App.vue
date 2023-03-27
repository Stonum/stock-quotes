<template>
  <div class="grid place-items-center">
    <div class="w-6/12">
      <input v-model="tiket" class="base-input" />
    </div>

    <div class="w-11/12">
      <stock-chart :prices="prices" :tiket="tiket" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect, computed } from "vue";
import { getHistoryStockQuotes } from "./api/moex";

import StockChart from "./components/StockChart.vue";

const tiket = ref("GAZP");
const fromDate = ref("2018-09-24");
const toDate = ref();

const prices = reactive<any>([]);

watchEffect(async () => {
  const data = await getHistoryStockQuotes(tiket.value, "TQBR", {
    fromDate: fromDate.value,
    toDate: toDate.value,
  });
  prices.splice(0);
  prices.push(...data.map((item: any) => [Date.parse(item.date), item.volume]));
});
</script>
