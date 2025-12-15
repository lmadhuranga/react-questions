import { configureStore } from '@reduxjs/toolkit'
import { usersApi } from './services/usersApi'
import { postsApi } from './services/postsApi'
import { authApi } from './services/authApi'
import authReducer from './features/auth/authSlice'

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(usersApi.middleware, postsApi.middleware, authApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
