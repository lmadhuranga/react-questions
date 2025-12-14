import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest'
import { delayedBaseQuery } from './baseApi'

const mockApi = { endpoint: 'test', type: 'query' } as any

describe('delayedBaseQuery', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } })),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('waits ~2s before firing the request', async () => {
    const promise = delayedBaseQuery('/posts', mockApi, {})

    expect(fetch).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1900)
    expect(fetch).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(200)
    await promise

    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
