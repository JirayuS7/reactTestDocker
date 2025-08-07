import { useEffect, useState } from 'react'
import './App.css'
import type { User } from './api'

interface AppProps {
  initialData?: User[];
}

function App({ initialData = [] }: AppProps) {
  const [users, setUsers] = useState<User[]>(initialData)

  useEffect(() => {
    // Only fetch on client if we don't have initial data from SSR
    if (initialData.length === 0) {
      const fetchUsers = async () => {
        try {
          // For client-side, use the proxy
          const response = await fetch('/api/users')
          console.log("🚀 ~ fetchUsers ~ response:", response)
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          const data = await response.json()
          setUsers(data)
        } catch (error) {
          console.error('Failed to fetch users:', error)
        }
      }

      fetchUsers()
    }
  }, [initialData.length])

  return (
    <>
      <h1>User List {initialData.length > 0 ? '(SSR)' : '(Client)'}</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} | {user.email}</li>
        ))}
      </ul>
    </>
  )
}

export default App
