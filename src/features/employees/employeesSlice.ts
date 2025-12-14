import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchEmployees, type Employee } from './employeesApi'

type EmployeesState = {
  items: Employee[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  selectedId: string | null
}

const initialState: EmployeesState = {
  items: [],
  status: 'idle',
  error: null,
  selectedId: null,
}

export const fetchEmployeesAsync = createAsyncThunk('employees/fetchAll', async () => {
  const employees = await fetchEmployees()
  return employees
})

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearEmployees: (state) => {
      state.items = []
      state.selectedId = null
      state.status = 'idle'
      state.error = null
    },
    selectEmployee: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeesAsync.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchEmployeesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchEmployeesAsync.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Unable to fetch employees'
      })
  },
})

export const { clearEmployees, selectEmployee } = employeesSlice.actions
export default employeesSlice.reducer
