<template>
  <vue-highcharts
    type="stockChart"
    :options="chartOptions"
    :redrawOnUpdate="true"
    :oneToOneUpdate="true"
    :animateOnUpdate="true"
    ref="chart"
  />
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect } from "vue";
import VueHighcharts from "vue3-highcharts";
import HighCharts from "highcharts";
import StockCharts from "highcharts/modules/stock";

import { getHistoryStockQuotes } from "../api/moex";

const props = defineProps<{
  securitie?: Securitie;
  fromDate: string;
  toDate: string;
}>();

StockCharts(HighCharts);

type ChartData = [number, number];
type SecuritieData = {
  [index: string]: ChartData[];
};

const chacheData: SecuritieData = {};

const chart = ref(null);
const chartOptions = reactive({
  chart: {
    height: "500px",
  },
  rangeSelector: {
    selected: 1,
  },
  series: [
    {
      name: "",
      data: [] as ChartData[],
    },
  ],
});

watchEffect(async () => {
  let chartData: ChartData[] = [];
  if (props.securitie) {
    if (chacheData[props.securitie.secid]) {
      chartData = chacheData[props.securitie.secid];
    } else {
      // @ts-ignore
      chart.value.chart.showLoading();
      const data = await getHistoryStockQuotes(
        props.securitie.secid,
        props.securitie.group,
        props.securitie.boardid,
        {
          fromDate: props.fromDate,
          toDate: props.toDate,
        }
      );

      chartData = data.map(
        (item: SecuritiePrice) =>
          [Date.parse(item.date), item.volume] as ChartData
      );
      // @ts-ignore
      chart.value.chart.hideLoading();

      chacheData[props.securitie.secid] = chartData;
    }
  }
  chartOptions.series[0].name = props.securitie?.secid ?? "";
  chartOptions.series[0].data = chartData;
});
</script>
