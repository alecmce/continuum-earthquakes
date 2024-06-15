<script setup lang="ts">
import { useEarthquakeData } from '../state/use-earthquake-data'
import EarthquakeItem from './EarthquakeItem.vue'
import SearchBar from './SearchBar.vue'

const earthquakeData = useEarthquakeData()
</script>

<template>
  <div id="earthquake-list">
    <h2>{{ earthquakeData.title }}</h2>
    <SearchBar />
    <EarthquakeItem
      v-for="feature in earthquakeData.data?.features ?? []"
      :key="feature.id"
      :feature="feature"
    />
  </div>
</template>

<style>
#earthquake-list {
  background-color: rgb(35 55 75 / 80%);
  border-radius: 1vmin;
  color: #fff;
  display: flex;
  flex-direction: column;
  left: 1vw;
  max-height: 98vh;
  min-width: 200px;
  overflow: scroll;
  padding: 1vmin;
  position: absolute;
  top: 1vh;
  width: 30vw;
  z-index: 1;
}

#earthquake-list h2 {
  color: #aee3ff;
  font-size: 2.5vmin;
  line-height: 1.1;
  margin: 0 0 1vmin 0;
  padding: 0;
}
</style>
