<template>
  <h1 class="mx-2 text-lg font-semibold text-gray-900 dark:text-white">Favorites stocks</h1> 
  <ul class="base-list mx-2" aria-labelledby="dropdownDefaultButton">
    <template v-for="securitie of items">
      <li>
        <a
          href="#"
          :class="[
            'base-list-item',
            isSelected(securitie.secid) ? 'base-list-item__selected' : '',
          ]"
          @click="onSelectSecuritie(securitie)"
          >{{ securitie.secid }} {{ securitie.name }}</a
        >
      </li>
    </template>
  </ul>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ items: Securitie[] }>();
const emit = defineEmits<{
  (e: "change", securitie: Securitie): void;
}>();

const selected = ref("");

const onSelectSecuritie = (payload: Securitie) => {
  emit("change", payload);
  selected.value = payload.secid;
};

const isSelected = (secid: string) => {
  return secid === selected.value;
};
</script>
