<template>
  <input
    :value="modelValue"
    @input="onInput"
    class="base-input"
    placeholder="Search"
  />

  <ul v-if="menu" class="base-menu" aria-labelledby="dropdownDefaultButton">
    <template v-for="securitie of securities">
      <li>
        <a href="#" class="base-menu-item" @click="onSelectSecuritie(securitie)"
          >{{ securitie.secid }} {{ securitie.name }}</a
        >
      </li>
    </template>
  </ul>
</template>

<script setup lang="ts">
import { ref, shallowReactive } from "vue";
import { getSecurities } from "../api/moex";

const props = defineProps<{ modelValue?: string }>();
const emit = defineEmits<{
  (e: "update:modelValue", modelValue: string): void;
  (e: "change", securitie: Securitie): void;
}>();

const securities = shallowReactive<Securitie[]>([]);
let timer = null as number | null;
const menu = ref(true);

const onInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value ?? "";
  emit("update:modelValue", value);
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    fillSecuties(value);
  }, 100);
};

const onSelectSecuritie = (securitie: Securitie) => {
  emit("update:modelValue", securitie.secid ?? "");
  emit("change", securitie);
  menu.value = false;
};

const fillSecuties = async (search: string) => {
  securities.splice(0);
  menu.value = false;
  if (search) {
    const data = await getSecurities(search);
    securities.splice(0);
    securities.push(...data);
    menu.value = true;
  }
};
</script>
