import type { Feature, FeatureCollection } from 'geojson'
import { produce, type Draft } from 'immer'

/**
 * Replaces Feature IDs in a GeoJSON FeatureCollection with integer IDs. Copies that ID into the feature.properties too.
 *
 * Mapbox expects numeric IDs, but GeoJSON provides string-prefixed IDs that cannot be parsed to integers. mapbox-gl's
 * `addSource` function provides a `promoteId` function that pulls a value out of the `Feature.properties` to act as the
 * Feature's internal mapbox ID. This function ensurescorresponding IDs between the raw FeatureCollection and MapBox,
 * assuming that downstream, `addSource` is called with `addSource({ ..., promoteId: 'id' })`.
 */
export function replaceGeoJsonIds(collection: FeatureCollection): FeatureCollection {
  let nextId = 1
  return produce(collection, (draft) => {
    draft.features.forEach(updateFeature)
  })

  function updateFeature(feature: Draft<Feature>): void {
    const id = nextId++
    feature.id = id
    if (feature.properties) {
      feature.properties.id = id
    } else {
      feature.properties = { id }
    }
  }
}
