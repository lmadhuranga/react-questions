import { createApi } from '@reduxjs/toolkit/query/react'
import { delayedBaseQuery } from './baseApi'

export type User = {
  id: number
  name: string
  email: string
}

export type NewUser = Omit<User, 'id'>

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: delayedBaseQuery,
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: (result) =>
        result
          ? [
              ...result.map((user) => ({ type: 'Users', id: user.id }) as const),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    getUser: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Users', id }],
    }),
    addUser: builder.mutation<User, NewUser>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const tempId = Date.now() * -1
        const patch = dispatch(
          usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
            draft.unshift({ ...body, id: tempId })
          }),
        )
        try {
          const { data } = await queryFulfilled
          dispatch(
            usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
              const idx = draft.findIndex((item) => item.id === tempId)
              if (idx !== -1) {
                draft[idx] = data
              }
            }),
          )
        } catch {
          patch.undo()
        }
      },
    }),
    updateUser: builder.mutation<User, Partial<User> & Pick<User, 'id'>>({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),
    deleteUser: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi
