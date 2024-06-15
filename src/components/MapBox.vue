<script setup lang="ts">
import { useMap } from './use-map.js'

const mapContainer = useMap()
</script>

<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<style>
.map-container {
  flex: 1;
}
</style>
