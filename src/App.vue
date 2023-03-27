<template>
  <div class="grid place-items-center">
    <div class="w-6/12">
      <SecuritiesInput v-model="securitie" @change="onChangeSecuritie" />
    </div>

    <div class="w-11/12">
      <stock-chart :prices="prices" :tiket="securitie" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect, onMounted } from "vue";
import { getHistoryStockQuotes } from "./api/moex";

import StockChart from "./components/StockChart.vue";
import SecuritiesInput from "./components/SecuritiesInput.vue";

const securitie = ref("GAZP");
const fromDate = ref("2018-09-24");
const toDate = ref();


const prices = reactive<any>([]);

const onChangeSecuritie = (async (securitie: Securitie) => {
  const data = await getHistoryStockQuotes(securitie.secid, securitie.group, securitie.boardid, {
    fromDate: fromDate.value,
    toDate: toDate.value,
  });
  prices.splice(0);
  prices.push(...data.map((item: SecuritiePrice) => [Date.parse(item.date), item.volume]));
});
</script>
