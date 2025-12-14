const EMPLOYEE_URL = 'https://samples.json-format.com/employees/json/employees_10KB.json'

type ApiEmployee = {
  employee: {
    id: string
    name: string
    position: string
    department?: {
      id?: string
      name?: string
      manager?: {
        id?: string
        name?: string
      }
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

export const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await fetch(EMPLOYEE_URL)
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  const data = (await response.json()) as ApiEmployee[]
  return data.map(({ employee }) => ({
    id: employee.id,
    name: employee.name,
    position: employee.position,
    departmentName: employee.department?.name ?? 'Unknown',
    managerName: employee.department?.manager?.name ?? 'Unassigned',
  }))
}
