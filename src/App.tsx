import { useEffect   } from 'react'
import './App.css'
import Calendar from './Celendar'
import ApiTest from './ApiTest'
import { Tabs } from 'antd'
 

function App() {
 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Using proxy - this will call the API
        // const response = await fetch('/api/users')

        const response2 = await fetch('/psei-api_new')
        console.log("🚀 ~ fetchUsers ~ response2:", response2)

 
        // if (!response.ok) {
        //   throw new Error('Network response was not ok')
        // }
        // const data = await response.json()
     
      } catch (error) {
        console.error('Failed to fetch users:', error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: 'API Test',
            children: <ApiTest />,
          },
          {
            key: '2',
            label: 'User List',
            children: (
              <>
                <h1>User List</h1>
                
              </>
            ),
          },
          {
            key: '3',
            label: 'Calendar',
            children: <Calendar />,
          },
        ]}
      />
    </>
  )
}

export default App
