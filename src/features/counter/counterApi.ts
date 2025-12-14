// Minimal mock API to demonstrate async calls with Redux Toolkit
export const fetchCount = (amount: number) =>
  new Promise<{ data: number }>((resolve) => {
    setTimeout(() => {
      resolve({ data: amount })
    }, 500)
  })
