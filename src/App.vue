<template>
  <div class="grid grid-cols-4">
   <div class="col-span-1"/>
   <div class="col-span-2">
      <securities-input class="w-full" v-model="tiker" @change="onChangeSecuritie" />
   </div>
   <div>
      <button type="button" class="base-button mt-1 mx-3" @click="onAddToFavorits">Add to favorites</button>
   </div>
  </div>

  <div class="grid grid-cols-5">
   <div class="col-span-1">
       <favorite-list :items="favorites" @change="onChangeSecuritie" />
   </div>
   
   <div class="col-span-4">
      <stock-chart
        :securitie="securitie"
        :from-date="fromDate"
        :to-date="toDate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef } from "vue";
import StockChart from "./components/StockChart.vue";
import SecuritiesInput from "./components/SecuritiesInput.vue";
import FavoriteList from "./components/FavoriteList.vue";

import { useStorage } from './composables/useStorage';

const tiker = ref('');
const securitie = shallowRef<Securitie | undefined>(undefined);
const fromDate = ref("2018-09-24");
const toDate = ref();

const favorites = useStorage<Securitie[]>('favorites', []);

const onChangeSecuritie = async (payload: Securitie) => {
   securitie.value = payload;
};

const onAddToFavorits = () => {
   if (securitie.value) {
      const index = favorites.findIndex((item: Securitie) => item.secid === securitie.value?.secid);
      if (index === -1) {
         favorites.push(securitie.value);
      }
   }
}
</script>
