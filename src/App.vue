<script setup lang="ts">
import '../node_modules/mapbox-gl/dist/mapbox-gl.css'
import EarthquakeList from './components/EarthquakeList.vue'
import MapBox from './components/MapBox.vue'
</script>

<template>
  <div id="layout">
    <MapBox />
    <EarthquakeList />
  </div>
</template>

<style>
#layout {
  flex: 1;
  display: flex;
  position: relative;
}
</style>
