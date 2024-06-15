import { onMounted, onUnmounted, reactive, toRef, type Ref } from 'vue'

interface Size {
  width: number
  height: number
}

export function useSize(): Ref<Size> {
  const size = reactive({ width: window.innerWidth, height: window.innerHeight })

  onMounted(() => {
    window.addEventListener('resize', onResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
  })

  return toRef(size)

  function onResize(): void {
    size.width = window.innerWidth
    size.height = window.innerHeight
  }
}
