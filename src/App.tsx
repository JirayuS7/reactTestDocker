 
import { useEffect, useState } from 'react'
import './App.css'

interface User {
  id: number;
  name: string;
  email : string;
}

function App() {

  const [users, setUsers] = useState<User[]>([])  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/users')
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
  }, [])

  return (
    <>
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} | {user.email}</li>
        ))}
      </ul>
    </>
  )
}

export default App
