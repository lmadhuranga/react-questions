import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const fallbackAuthUrl = 'https://mp28703c477f2175a9a2.free.beeceptor.com'
const authBaseUrl = import.meta.env.VITE_AUTH_BASE_URL ?? fallbackAuthUrl

export type LoginRequest = {
  username: string
  password: string
}

export type LoginResponse = unknown

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: authBaseUrl }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useLoginMutation } = authApi
