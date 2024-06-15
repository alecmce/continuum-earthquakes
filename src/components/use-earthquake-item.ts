import chroma from 'chroma-js'
import type { Feature } from 'geojson'
import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { useHover } from '../state/use-hover'
import { useSelection } from '../state/use-selection'

interface EarthquakeItem {
  isSelected: ComputedRef<boolean>
  location: Ref<string>
  magnitude: ComputedRef<MagnitudeInfo>
  onClick: VoidFunction
  onShiftClick: VoidFunction
  setHover: VoidFunction
  clearHover: VoidFunction
  time: ComputedRef<string>
}

interface MagnitudeInfo {
  value: number
  label: string
  style: {
    backgroundColor: string
    color: string
  }
}

interface Props {
  feature: Feature
}

/**
 * Called in the setup of `EarthquakeItem.vue` to provide the view-model for an interactive element that corresponds to
 * a particular earthquake event.
 */
export function useEarthquakeItem(props: Props): EarthquakeItem {
  const selection = useSelection()
  const hover = useHover()

  const location = ref(props.feature.properties?.place)
  const magnitude = computed(getMagnitude)
  const time = computed(getTime)
  const isSelected = computed(getIsSelected)

  return { location, magnitude, time, onClick, onShiftClick, isSelected, setHover, clearHover }

  function getMagnitude(): MagnitudeInfo {
    const value = props.feature.properties?.mag ?? 0
    return { value, label: value.toFixed(1), style: getStyle(value) }
  }

  function getTime(): string {
    const time = props.feature.properties?.time
    return new Date(time).toLocaleDateString()
  }

  function getIsSelected(): boolean {
    return selection.isSelected(props.feature)
  }

  function onClick(): void {
    selection.setSelection(props.feature)
  }

  function onShiftClick(): void {
    selection.toggleSelected(props.feature)
  }

  function setHover(): void {
    hover.setHover(props.feature)
  }

  function clearHover(): void {
    hover.clearHover(props.feature)
  }
}

const COLOR_SCALE = chroma.scale(chroma.brewer.YlOrRd).domain([0, 10])

function getStyle(value: number): MagnitudeInfo['style'] {
  const backgroundColor = COLOR_SCALE(value).hex()
  const contrast = chroma.contrast(backgroundColor, 'white')
  const color = contrast < 4.5 ? 'black' : 'white'
  return { backgroundColor, color }
}
