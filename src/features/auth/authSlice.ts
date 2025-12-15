import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
  isAuthenticated: boolean
}

const initialState: AuthState = {
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload
    },
    logout: () => initialState,
  },
})

export const { setAuthenticated, logout } = authSlice.actions
export default authSlice.reducer
