import { cache, performance } from '../performance'

describe('Performance utilities', () => {
  describe('cache', () => {
    beforeEach(() => {
      cache.clear()
    })

    it('stores and retrieves values', () => {
      cache.set('key1', 'value1')
      expect(cache.get('key1')).toBe('value1')
    })

    it('returns undefined for non-existent keys', () => {
      expect(cache.get('nonexistent')).toBeUndefined()
    })

    it('clears all values', () => {
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      cache.clear()
      expect(cache.get('key1')).toBeUndefined()
      expect(cache.get('key2')).toBeUndefined()
    })
  })

  describe('performance', () => {
    it('measures execution time', async () => {
      const testFn = () => new Promise(resolve => setTimeout(resolve, 100))
      const result = await performance.measure('test', testFn)
      
      expect(result.duration).toBeGreaterThan(90)
      expect(result.duration).toBeLessThan(150)
    })

    it('handles synchronous functions', () => {
      const testFn = () => 'result'
      const result = performance.measureSync('test', testFn)
      
      expect(result.result).toBe('result')
      expect(result.duration).toBeGreaterThanOrEqual(0)
    })

    it('debounces function calls', (done) => {
      let callCount = 0
      const testFn = () => { callCount++ }
      const debouncedFn = performance.debounce(testFn, 50)
      
      debouncedFn()
      debouncedFn()
      debouncedFn()
      
      setTimeout(() => {
        expect(callCount).toBe(1)
        done()
      }, 100)
    })

    it('throttles function calls', (done) => {
      let callCount = 0
      const testFn = () => { callCount++ }
      const throttledFn = performance.throttle(testFn, 50)
      
      throttledFn()
      throttledFn()
      throttledFn()
      
      setTimeout(() => {
        expect(callCount).toBe(1)
        done()
      }, 100)
    })
  })
})
