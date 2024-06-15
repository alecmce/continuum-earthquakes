interface Props<T> {
  getString: (item: T) => string
  source: T[]
  substring: string
}

/**
 * Returns a filtered array of items, returns a function for extracting a string from that item and a
 * substring that must be contained in that name.
 */
export function filterBySubstring<T>(props: Props<T>): T[] {
  const { getString, source, substring } = props

  return source.filter(filterItem)

  function filterItem(item: T): boolean {
    console.log(getString(item), substring, getString(item).includes(substring))
    return getString(item).includes(substring)
  }
}
