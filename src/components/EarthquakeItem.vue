<script setup lang="ts">
import type { Feature } from 'geojson'
import { useEarthquakeItem } from './use-earthquake-item'

const props = defineProps<{ feature: Feature }>()
const item = useEarthquakeItem(props)
</script>

<template>
  <div
    :class="{ 'earthquake-item': true, selected: item.isSelected?.value }"
    @click.shift="item.addToSelection"
    @click.exact="item.setSelection"
    @mouseover="item.setHover"
    @mouseleave="item.clearHover"
  >
    <h3>{{ item.location?.value }}</h3>
    <div class="earthquake-details">
      <div class="earthquake-magnitude" :style="item.magnitude?.value.style">
        {{ item.magnitude?.value.label }}
      </div>
      <p>{{ item.time?.value }}</p>
    </div>
  </div>
</template>

<style>
.earthquake-item {
  background-color: rgb(35 55 75 / 80%);
  border-radius: 1vmin;
  display: flex;
  flex-direction: column;
  margin: 0.5vmin 0;
  padding: 1vmin;
  cursor: pointer;
  font-size: 1.6vmin;
  transition: background-color 200ms ease;
  user-select: none;
}

.earthquake-item.selected,
.earthquake-item.selected:hover {
  background-color: rgb(96 163 96 / 80%);
}

.earthquake-item:hover {
  background-color: rgb(96 130 163 / 80%);
}

.earthquake-item .earthquake-details {
  display: flex;
  flex-direction: row;
}

.earthquake-item .earthquake-magnitude {
  border: solid 1px white;
  padding: 0 1vmin;
  height: min-content;
  margin-right: 1vmin;
  border-radius: 1vmin;
}
</style>
