import { ref } from 'vue-demi'
import { defaultWindow } from '../_configurable'
import type { ConfigurableWindow } from '../_configurable'

export interface EyeDropperOpenOptions {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
   */
  signal?: AbortSignal
}

export interface EyeDropper {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new(): EyeDropper
  open: (options?: EyeDropperOpenOptions) => Promise<{ sRGBHex: string }>
  [Symbol.toStringTag]: 'EyeDropper'
}

export interface UseEyeDropperOptions {
  /**
   * Initial sRGBHex.
   *
   * @default ''
   */
  initialValue?: string
}

/**
 * Reactive [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API)
 *
 * @see https://vueuse.org/useEyeDropper
 * @param initialValue string
 */
export function useEyeDropper(options: UseEyeDropperOptions & ConfigurableWindow = {}) {
  const { initialValue = '', window = defaultWindow } = options
  const isSupported = Boolean(typeof window !== 'undefined' && 'EyeDropper' in window)
  const sRGBHex = ref(initialValue)

  async function open(openOptions?: EyeDropperOpenOptions) {
    if (!isSupported)
      return
    const eyeDropper: EyeDropper = new (window as any).EyeDropper()
    const result = await eyeDropper.open(openOptions)
    sRGBHex.value = result.sRGBHex
    return result
  }

  return { isSupported, sRGBHex, open }
}
