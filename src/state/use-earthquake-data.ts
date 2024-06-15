import {
  type Feature,
  type FeatureCollection,
  type GeoJsonProperties,
  type Geometry
} from 'geojson'
import { defineStore } from 'pinia'
import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { filterBySubstring } from '../lib/filter-by-substring'
import { replaceGeoJsonIds } from '../lib/replace-geojson-ids'

const URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'

interface EarthquakeData {
  data: ComputedRef<FeatureCollection<Geometry, GeoJsonProperties> | null>
  title: ComputedRef<string>
  loading: Promise<void>
  setFilter: (substring: string) => void
  clearFilter: VoidFunction
}

/** Fetches earthquake data from the statically defined URL above, and serves it as a Pinia store. */
export const useEarthquakeData = defineStore<'earthquakeData', EarthquakeData>(
  'earthquakeData',
  () => {
    const source = ref<FeatureCollection<Geometry, GeoJsonProperties> | null>(null)
    const substring = ref<string>('')

    const loading = loadData(source)

    const data = computed(getFiltered)
    const title = computed(getTitle)

    return { data, loading, title, setFilter, clearFilter }

    function getTitle(): string {
      /* @ts-expect-error Metadata not part of type. Attempted fix in global.d.ts isn't being picked up. */
      return data.value?.metadata.title ?? '[loading...]'
    }

    function getFiltered(): FeatureCollection<Geometry, GeoJsonProperties> {
      const features =
        source.value && substring.value
          ? filterBySubstring({
              source: source.value.features,
              getString: getPlace,
              substring: substring.value
            })
          : undefined

      return features
        ? ({ ...source.value, features } as FeatureCollection<Geometry, GeoJsonProperties>)
        : (source.value as FeatureCollection<Geometry, GeoJsonProperties>)
    }

    function setFilter(value: string): void {
      substring.value = value
    }

    function clearFilter(): void {
      substring.value = ''
    }
  }
)

async function loadData(data: Ref<FeatureCollection | null>): Promise<void> {
  try {
    const response = await fetch(URL)
    const json = await response.json()
    data.value = replaceGeoJsonIds(json)
  } catch (error) {
    console.error('Error fetching earthquake data:', error)
  }
}

function getPlace(feature: Feature): string {
  return feature.properties?.place ?? ''
}
