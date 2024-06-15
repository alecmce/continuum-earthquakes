import type { Feature } from 'geojson'
import { describe, expect, it } from 'vitest'
import { getLngLatBounds } from './get-lng-lat-bounds'
import { coerce } from './util'
import { LngLatBounds } from 'mapbox-gl'

describe('getLngLatBounds', () => {
  it('returns single coordinates as a LngLatBounds', () => {
    const selected = {
      foo: coerce<Feature>({ geometry: { coordinates: [1, 6], type: 'Point' } })
    }

    const actual = getLngLatBounds(selected)
    expect(actual).toEqual(new LngLatBounds([1, 6], [1, 6]))
  })

  it('returns the union of the coordinates as a LngLatBounds', () => {
    const selected = {
      foo: coerce<Feature>({ geometry: { coordinates: [1, 6], type: 'Point' } }),
      bar: coerce<Feature>({ geometry: { coordinates: [3, 2], type: 'Point' } })
    }

    const actual = getLngLatBounds(selected)
    expect(actual).toEqual(new LngLatBounds([1, 2], [3, 6]))
  })
})
