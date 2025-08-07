import { useState } from 'react'
import { Button, Card, Typography, Space, Alert } from 'antd'

const { Title, Text, Paragraph } = Typography

export default function ApiTest() {
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testApiEndpoint = async (endpoint: string) => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      console.log(`Testing: ${endpoint}`)
      const res = await fetch(endpoint)
      
      console.log('Response status:', res.status)
      console.log('Response headers:', res.headers)
      
      const contentType = res.headers.get('content-type')
      console.log('Content-Type:', contentType)
      
      if (contentType?.includes('application/json')) {
        const data = await res.json()
        setResponse({ status: res.status, data, contentType })
      } else {
        const text = await res.text()
        setResponse({ status: res.status, data: text, contentType })
      }
    } catch (err: any) {
      setError(err.message)
      console.error('API Test Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>API Testing Tool</Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="Test Different Endpoints">
          <Space wrap>
            <Button 
              onClick={() => testApiEndpoint('/api')} 
              loading={loading}
              type="primary"
            >
              Test /api (proxy)
            </Button>
            {/* <Button 
              onClick={() => testApiEndpoint('/psei-api_new')} 
              loading={loading}
            >
              Test /psei-api_new/RoleList (direct proxy)
            </Button> */}
         
          </Space>
        </Card>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
          />
        )}

        {response && (
          <Card title={`Response (Status: ${response.status})`}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Content-Type: {response.contentType}</Text>
              
              <Title level={4}>Response Data:</Title>
              
              {typeof response.data === 'string' ? (
                <Paragraph>
                  <Text code>{response.data}</Text>
                </Paragraph>
              ) : (
                <Paragraph>
                  <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                </Paragraph>
              )}
            </Space>
          </Card>
        )}

        <Card title="API Information">
          <Space direction="vertical">
            <Text>
              <strong>Frontend Server:</strong> http://localhost:5173
            </Text>
            <Text>
              <strong>Proxy Target:</strong> https://netsoftdev.com/psei-api_new
            </Text>
            <Text>
              <strong>Expected Behavior:</strong> API calls should return JSON data
            </Text>
          </Space>
        </Card>
      </Space>
    </div>
  )
}
