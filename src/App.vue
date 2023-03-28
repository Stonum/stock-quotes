<template>
  <div class="grid place-items-center">
    <div class="w-6/12">
      <securities-input v-model="tiker" @change="onChangeSecuritie" />
    </div>

    <div class="w-11/12">
      <stock-chart
        :securitie="securitie"
        :from-date="fromDate"
        :to-date="toDate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import StockChart from "./components/StockChart.vue";
import SecuritiesInput from "./components/SecuritiesInput.vue";

const tiker = ref('');
const securitie = ref<Securitie | undefined>(undefined);
const fromDate = ref("2018-09-24");
const toDate = ref();

const onChangeSecuritie = async (payload: Securitie) => {
   securitie.value = payload;
};
</script>
