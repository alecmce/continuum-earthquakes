interface Props<T> {
  getString: (item: T) => string
  source: T[]
  substring: string
}

export function filterBySubstring<T>(props: Props<T>): T[] {
  const { getString, source, substring } = props

  return source.filter(filterItem)

  function filterItem(item: T): boolean {
    console.log(getString(item), substring, getString(item).includes(substring))
    return getString(item).includes(substring)
  }
}
