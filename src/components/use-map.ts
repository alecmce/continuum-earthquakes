import type { Feature, FeatureCollection } from 'geojson'
import mapbox, { Map, type CircleLayer } from 'mapbox-gl'
import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import { getLngLatBounds } from '../lib/get-lng-lat-bounds'
import { useEarthquakeData } from '../state/use-earthquake-data'
import { useHover } from '../state/use-hover'
import { useSelection, type SelectedFeatures } from '../state/use-selection'

const ACCESS_TOKEN =
  'pk.eyJ1IjoiYWxlY21jZSIsImEiOiJjbHhjOGV2OTgwamdnMmtzM3ppM3kyYW50In0.2OJ6lceaJIk8jPA-5V3HaQ'
const SOURCE_ID = 'earthquake-data'
const LAYER_ID = 'earthquake-data-layer'
const HOVER_ID = 'hover'
const SELECTED_ID = 'selected'

const STYLE: Pick<CircleLayer, 'type' | 'paint'> = {
  type: 'circle',
  paint: {
    'circle-radius': ['case', ['boolean', ['feature-state', SELECTED_ID], false], 12, 6],
    'circle-stroke-width': 2,
    'circle-color': ['case', ['boolean', ['feature-state', HOVER_ID], false], 'orange', 'red'],
    'circle-stroke-color': 'black'
  }
}

interface MapLocation {
  center: LngLat
  bearing: number
  pitch: number
  zoom: number
}

interface LngLat {
  lng: number
  lat: number
}

const EDINBURGH: MapLocation = {
  center: { lng: -3.4361, lat: 56.1495 },
  bearing: 0,
  pitch: 0,
  zoom: 7.5
}

/**
 * Called in the setup of `Map.vue` to provide the view-model for a MapBox map interation. This is the central
 * controller for interacting with MapBox:
 *
 * * when earthquake data is changed, it adds the earthquake layer;
 * * when hover is changed, it changes the style of the layer's feature-state to surface the hover on the map;
 * * when selection is changed it calls `fitBounds` to move the map to show the earthquake, as well as updating the
 *   layer's feature-state;
 * * when the user interacts with the map directly, the selection is cleared.
 */
export function useMap(): Ref<HTMLDivElement | null> {
  const earthquakeData = useEarthquakeData()
  const selection = useSelection()
  const hover = useHover()

  let map: Map | null = null
  let isIdle = true
  let hoverId: string | number | null = null

  const container = ref<HTMLDivElement | null>(null)

  onMounted(mount)
  watch(() => earthquakeData.data, addEarthquakes)
  watch(() => selection.selected, onSelectionUpdated)
  watch(() => hover.hover, updateHover)
  onUnmounted(unmount)

  return container

  async function mount() {
    mapbox.accessToken = ACCESS_TOKEN

    map = new Map({
      ...EDINBURGH,
      container: container.value!,
      style: 'mapbox://styles/mapbox/standard'
    })

    map.on('move', updateLocation)
    map.on('rotate', updateLocation)
    map.on('pitch', updateLocation)
  }

  function updateLocation() {
    if (isIdle) {
      selection.clearSelection()
    }
  }

  function addEarthquakes(earthquakeData: FeatureCollection | null): void {
    console.log('testing')
    if (map && earthquakeData) {
      map.on('load', add)
      console.log('here')
    }

    function add(): void {
      if (map && earthquakeData) {
        map.addSource(SOURCE_ID, { data: earthquakeData, promoteId: 'id', type: 'geojson' })
        map.addLayer({ id: LAYER_ID, source: SOURCE_ID, ...STYLE, filter: ['has', 'id'] })
        map.setFilter(LAYER_ID, null)
      }
    }
  }

  function onSelectionUpdated(selected: SelectedFeatures | undefined): void {
    const bounds = selected ? getLngLatBounds(selected) : undefined
    if (bounds) {
      isIdle = false
      map?.fitBounds(bounds, { padding: 20, maxZoom: 8 })
      map?.once('idle', () => {
        isIdle = true
      })
    }
    updateFatureState()
  }

  function updateHover(feature: Feature | null): void {
    if (feature?.id) {
      hoverId = feature.id
      updateFeatureState(feature.id, HOVER_ID, true)
    } else if (hoverId) {
      updateFeatureState(hoverId, HOVER_ID, false)
      hoverId = null
    }
  }

  function updateFatureState(): void {
    earthquakeData.data?.features.forEach(update)

    function update(feature: Feature): void {
      if (feature.id) {
        const { id } = feature
        const isHover = hoverId === id
        const isSelected = isHover || selection.isSelected(feature)
        updateFeatureState(id, SELECTED_ID, isSelected)
        updateFeatureState(id, HOVER_ID, isHover)
      }
    }
  }

  function updateFeatureState(id: string | number, stateId: string, value: boolean): void {
    map?.setFeatureState({ source: SOURCE_ID, id }, { [stateId]: value })
  }

  function unmount(): void {
    map?.remove()
    map = null
  }
}
