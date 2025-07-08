// @ts-nocheck
import { useCallback, MutableRefObject } from 'react'

/**
 * Combine multiple refs into a single ref callback
 */
export function useCombinedRefs<T = any>(
  ...refs: Array<MutableRefObject<T | null> | ((instance: T | null) => void) | null | undefined>
) {
  return useCallback(
    (element: T | null) => {
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(element)
        } else if (ref != null) {
          ref.current = element
        }
      })
    },
    [refs]
  )
}


