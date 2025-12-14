import { fetchBaseQuery, type BaseQueryFn } from '@reduxjs/toolkit/query/react'
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'

const fallbackBaseUrl = 'https://jsonplaceholder.typicode.com'
export const baseUrl = import.meta.env.VITE_API_BASE_URL ?? fallbackBaseUrl

const rawBaseQuery = fetchBaseQuery({ baseUrl })
const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const delayedBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  await pause(2000)
  return rawBaseQuery(args, api, extraOptions)
}
