import { reactive, shallowReactive, watchEffect } from 'vue';


export function useStorage<T extends Object>(key: string, defaultValue: T) {

  let item = shallowReactive<T>(defaultValue);

  const storageValue = localStorage.getItem(key);
  if (storageValue) {
    item = shallowReactive(JSON.parse(storageValue));
  }

  watchEffect(() => {
    localStorage.setItem(key, JSON.stringify(item));
  })

  return item;
}