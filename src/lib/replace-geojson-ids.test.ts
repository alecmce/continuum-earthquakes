import { FeatureCollection, type Feature } from 'geojson'
import { describe, expect, it } from 'vitest'
import { replaceGeoJsonIds } from './replace-geojson-ids'
import { coerce } from './util'
import { LngLatBounds } from 'mapbox-gl'

describe('replaceGeoJsonIds', () => {
  it('replaces ids with integers, and adds corresponding ids to feature properties', () => {
    const collection = coerce<FeatureCollection>({
      type: 'FeatureCollection',
      features: [
        coerce<Feature>({ type: 'Feature', id: 'foo', properties: { position: [1, 2] } }),
        coerce<Feature>({ type: 'Feature', id: 'bar', properties: { position: [3, 4] } })
      ],
      metadata: { foo: 'bar' }
    })

    const actual = replaceGeoJsonIds(collection)
    expect(actual).toEqual({
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', id: 1, properties: { id: 1, position: [1, 2] } },
        { type: 'Feature', id: 2, properties: { id: 2, position: [3, 4] } }
      ],
      metadata: { foo: 'bar' }
    })
  })
})
