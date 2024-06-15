import { describe, it, expect } from 'vitest'
import { filterBySubstring } from './filter-by-substring'

describe('filterBySubstring', () => {
  const SOURCE = [{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }]

  it('returns all items when the substring is trivial', () => {
    const actual = filterBySubstring({
      source: SOURCE,
      getString: (object) => object.name,
      substring: ''
    })
    expect(actual).toEqual(SOURCE)
  })

  it('returns the substring matching names when non-trivial', () => {
    const actual = filterBySubstring({
      source: SOURCE,
      getString: (object) => object.name,
      substring: 'ba'
    })
    expect(actual).toEqual([{ name: 'bar' }, { name: 'baz' }])
  })

  it('returns an empty array when there is no match', () => {
    const actual = filterBySubstring({
      source: SOURCE,
      getString: (object) => object.name,
      substring: 'zz'
    })
    expect(actual).toEqual([])
  })
})
