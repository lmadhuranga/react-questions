import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type ApiEmployee = {
  employee: {
    id: string
    name: string
    position: string
    department?: {
      name?: string
      manager?: { name?: string }
    }
  }
}

export type Employee = {
  id: string
  name: string
  position: string
  departmentName: string
  managerName: string
}

export const employeeApi = createApi({
  reducerPath: 'employeeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://samples.json-format.com',
  }),
  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], void>({
      query: () => '/employees/json/employees_10KB.json',
      transformResponse: (raw: ApiEmployee[]) =>
        raw.map(({ employee }) => ({
          id: employee.id,
          name: employee.name,
          position: employee.position,
          departmentName: employee.department?.name ?? 'Unknown',
          managerName: employee.department?.manager?.name ?? 'Unassigned',
        })),
    }),
  }),
})

export const { useGetEmployeesQuery } = employeeApi
