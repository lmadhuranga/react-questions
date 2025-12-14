import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchCount } from './counterApi'

type CounterState = {
  value: number
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: CounterState = { value: 0, status: 'idle', error: null }

export const fetchCountAsync = createAsyncThunk('counter/fetchCount', async (amount: number) => {
  const response = await fetchCount(amount)
  return response.data
})

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountAsync.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCountAsync.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.value += action.payload
      })
      .addCase(fetchCountAsync.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Request failed'
      })
  },
})

export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions
export default counterSlice.reducer
