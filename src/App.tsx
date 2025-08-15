import { useEffect, useState } from 'react'
import './App.css'
import Calendar from './Celendar'
import ApiTest from './ApiTest'
import { Tabs, Alert, Space } from 'antd'
import { apiClient, getEnvironmentInfo } from './utils/api'

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([])
  const envInfo = getEnvironmentInfo()
 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Use the new API client that works in both dev and production
        const data = await apiClient.get('/users')
        setUsers(data)
        console.log('Users fetched:', data)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <>
      <Tabs
        defaultActiveKey="4"
        items={[
          {
            key: '1',
            label: 'Environment Info',
            children: (
              <div style={{ padding: '20px' }}>
                <Alert
                  message="Deployment Configuration"
                  description={
                    <Space direction="vertical">
                      <div><strong>Environment:</strong> {envInfo.isDev ? 'Development' : 'Production'}</div>
                      <div><strong>API Base URL:</strong> {envInfo.baseUrl}</div>
                      <div><strong>Mode:</strong> {envInfo.nodeEnv}</div>
                    </Space>
                  }
                  type="info"
                  showIcon
                />
              </div>
            ),
          },
          {
            key: '2',
            label: 'API Test',
            children: <ApiTest />,
          },
          {
            key: '3',
            label: 'User List',
            children: (
              <>
                <h1>User List</h1>
                <ul>
                  {users.map(user => (
                    <li key={user.id}>{user.name} | {user.email}</li>
                  ))}
                </ul>
              </>
            ),
          },
          {
            key: '4',
            label: 'Calendar',
            children: <Calendar />,
          },
        ]}
      />
    </>
  )
}

export default App
