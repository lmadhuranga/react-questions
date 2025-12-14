import { createApi, fetchBaseQuery, type BaseQueryFn } from '@reduxjs/toolkit/query/react'
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'

type ApiTodo = {
  userId: number
  id: number
  title: string
  completed: boolean
}

export type Todo = {
  id: number
  title: string
  completed: boolean
  userId: number
}

export type NewTodoPayload = {
  title: string
  completed?: boolean
  userId?: number
}

export type UpdateTodoPayload = {
  id: number
  title?: string
  completed?: boolean
}

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const rawBaseQuery = fetchBaseQuery({
  baseUrl: 'https://jsonplaceholder.typicode.com',
})

const delayedBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  await pause(800) // simulate server/network latency
  return rawBaseQuery(args, api, extraOptions)
}

export const todoApi = createApi({
  reducerPath: 'todoApi',
  tagTypes: ['Todos'],
  baseQuery: delayedBaseQuery,
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], number | void>({
      query: (limit = 12) => `/todos?_limit=${limit}`,
      transformResponse: (raw: ApiTodo[]) =>
        raw.map((todo) => ({
          id: todo.id,
          title: todo.title,
          completed: todo.completed,
          userId: todo.userId,
        })),
      providesTags: (result) =>
        result
          ? [
              ...result.map((todo) => ({ type: 'Todos', id: todo.id }) as const),
              { type: 'Todos', id: 'LIST' },
            ]
          : [{ type: 'Todos', id: 'LIST' }],
    }),
    createTodo: builder.mutation<Todo, NewTodoPayload>({
      query: (body) => ({
        url: '/todos',
        method: 'POST',
        body: { completed: false, userId: 1, ...body },
      }),
      invalidatesTags: [{ type: 'Todos', id: 'LIST' }],
    }),
    updateTodo: builder.mutation<Todo, UpdateTodoPayload>({
      query: ({ id, ...body }) => ({
        url: `/todos/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Todos', id: arg.id },
        { type: 'Todos', id: 'LIST' },
      ],
    }),
    deleteTodo: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Todos', id },
        { type: 'Todos', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todoApi
