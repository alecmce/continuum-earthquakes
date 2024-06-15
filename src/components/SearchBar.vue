<script setup lang="ts">
import { useEarthquakeData } from '@/state/use-earthquake-data'

const earthquakeData = useEarthquakeData()

function setFilter(event: Event): void {
  earthquakeData.setFilter((event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="search-bar">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#e8eaed"
    >
      <path
        d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
      />
    </svg>
    <input type="text" placeholder="Filter by text" @input="setFilter" />
  </div>
</template>

<style>
.search-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.search-bar input[type='text'] {
  width: 100%;
  border-radius: 1vmin;
  webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  box-shadow: none !important;
  margin: 1vmin;
  padding: 0.5vmin 1vmin;
}
</style>
