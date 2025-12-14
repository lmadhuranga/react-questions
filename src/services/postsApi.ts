import { createApi } from '@reduxjs/toolkit/query/react'
import { delayedBaseQuery } from './baseApi'

export type Post = {
  id: number
  userId: number
  title: string
  body: string
}

export type NewPost = Omit<Post, 'id'>

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: delayedBaseQuery,
  tagTypes: ['Posts'],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => '/posts',
      providesTags: (result) =>
        result
          ? [
              ...result.map((post) => ({ type: 'Posts', id: post.id }) as const),
              { type: 'Posts', id: 'LIST' },
            ]
          : [{ type: 'Posts', id: 'LIST' }],
    }),
    getPost: builder.query<Post, number>({
      query: (id) => `/posts/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Posts', id }],
    }),
    addPost: builder.mutation<Post, NewPost>({
      query: (body) => ({
        url: '/posts',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const tempId = Date.now() * -1
        const patch = dispatch(
          postsApi.util.updateQueryData('getPosts', undefined, (draft) => {
            draft.unshift({ ...body, id: tempId })
          }),
        )
        try {
          const { data } = await queryFulfilled
          dispatch(
            postsApi.util.updateQueryData('getPosts', undefined, (draft) => {
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
    updatePost: builder.mutation<Post, Partial<Post> & Pick<Post, 'id'>>({
      query: ({ id, ...body }) => ({
        url: `/posts/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'Posts', id },
        { type: 'Posts', id: 'LIST' },
      ],
    }),
    deletePost: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'Posts', id },
        { type: 'Posts', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi
