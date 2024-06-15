import type { Feature } from 'geojson'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export interface Selection {
  selected: Ref<SelectedFeatures>
  clearSelection: VoidFunction
  setSelection: (feature: Feature) => void
  toggleSelected: (feature: Feature) => void
  isSelected: (feature: Feature) => boolean
}

export interface SelectedFeatures {
  [id: string]: Feature
}

/** Exposes a model for selecting and hovering-over GeoJSON features. */
export const useSelection = defineStore<'selection', Selection>('selection', () => {
  const selected = ref<SelectedFeatures>({})

  return {
    selected,
    clearSelection,
    setSelection,
    toggleSelected,
    isSelected
  }

  function clearSelection(): void {
    selected.value = {}
  }

  function setSelection(feature: Feature): void {
    const { id } = feature
    if (id) {
      selected.value = { [id]: feature }
    }
  }

  function toggleSelected(feature: Feature): void {
    const { id } = feature
    if (id) {
      const updated = { ...selected.value }
      if (updated[id]) {
        delete updated[id]
      } else {
        updated[id] = feature
      }
      selected.value = updated
    }
  }

  function isSelected(feature: Feature): boolean {
    const { id } = feature
    return !!(id && selected.value[id])
  }
})
