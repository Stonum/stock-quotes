<template>
  <vue-highcharts
    type="stockChart"
    :options="chartOptions"
    :redrawOnUpdate="true"
    :oneToOneUpdate="true"
    :animateOnUpdate="true"
  />
</template>

<script setup lang="ts">
import { reactive, watchEffect } from "vue";
import VueHighcharts from "vue3-highcharts";
import HighCharts from "highcharts";
import StockCharts from "highcharts/modules/stock";

import { getHistoryStockQuotes } from "../api/moex";

const props = defineProps<{ securitie?: Securitie, fromDate: string, toDate: string }>();

StockCharts(HighCharts);

type ChartData = [number, number];

const chartOptions = reactive({
      rangeSelector: {
         selected: 4,
      },
      series: [
         {
            name: props.securitie?.secid ?? '',
            data: [] as ChartData[],
         },
      ],
   }
);

watchEffect(async () => {
   if (props.securitie) {
      const data = await getHistoryStockQuotes(props.securitie.secid, props.securitie.group, props.securitie.boardid, {
       fromDate: props.fromDate,
       toDate: props.toDate,
      });
      chartOptions.series[0].name = props.securitie?.secid ?? '';
      chartOptions.series[0].data.splice(0);
      chartOptions.series[0].data.push(...data.map((item: SecuritiePrice) => [Date.parse(item.date), item.volume] as ChartData));
   } else {
      chartOptions.series[0] = { name: '', data: [] };
   }
})

</script>
