import type { Feature } from 'geojson'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export interface Hover {
  hover: Ref<Feature | null>
  setHover: (feature: Feature) => void
  clearHover: (feature: Feature) => void
  isHovered: (feature: Feature) => boolean
}

/** Exposes a model for selecting and hovering-over GeoJSON features. */
export const useHover = defineStore<'hover', Hover>('hover', () => {
  const hover = ref<Feature | null>(null)

  return {
    hover,
    setHover,
    clearHover,
    isHovered
  }

  function setHover(feature: Feature): void {
    hover.value = feature
  }

  function clearHover(feature: Feature): void {
    if (hover.value === feature) {
      hover.value = null
    }
  }

  function isHovered(feature: Feature): boolean {
    return hover.value === feature
  }
})
