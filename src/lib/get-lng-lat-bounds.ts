import type { Feature } from 'geojson'
import { LngLatBounds } from 'mapbox-gl'
import type { SelectedFeatures } from '../state/use-selection'

/**
 * Converts an array of selected features to LngLatBounds that can be used to center MapBox over
 * multiply-selected features.
 */
export function getLngLatBounds(selected: SelectedFeatures): LngLatBounds | undefined {
  const features = Object.values(selected)
  const first = features.length ? getCoordinates(features[0]) : undefined
  return first ? features.reduce(extendBounds, new LngLatBounds(first, first)) : undefined
}

function extendBounds(bounds: LngLatBounds, feature: Feature): LngLatBounds {
  const coords = getCoordinates(feature)
  return coords ? bounds.extend(coords) : bounds
}

function getCoordinates(feature: Feature): [lng: number, lat: number] | undefined {
  if (feature.geometry.type === 'Point') {
    return feature.geometry.coordinates as [lng: number, lat: number]
  } else {
    return undefined
  }
}
