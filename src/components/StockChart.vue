<template>
  <vue-highcharts
    type="stockChart"
    :options="chartOptions"
    :redrawOnUpdate="true"
    :oneToOneUpdate="false"
    :animateOnUpdate="true"
  />
</template>

<script setup lang="ts">
import { watch } from "vue";
import VueHighcharts from "vue3-highcharts";
import HighCharts from "highcharts";
import StockCharts from "highcharts/modules/stock";

const props = defineProps<{ prices: any[]; tiket: string }>();

StockCharts(HighCharts);

const chartOptions = {
  rangeSelector: {
    selected: 1,
  },

  series: [
    {
      name: props.tiket,
      data: props.prices,
    },
  ],
};
</script>
