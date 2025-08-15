// API configuration for different environments
const getApiBaseUrl = () => {
  // In development, use proxy
  if (import.meta.env.DEV) {
    return '/api'
  }
  
  // In production, use direct API URL or environment variable
  return import.meta.env.VITE_API_BASE_URL || 'https://netsoftdev.com/psei-api_new'
}

// API utility functions
export const apiClient = {
  baseUrl: getApiBaseUrl(),
  
  async get(endpoint: string) {
    const url = `${this.baseUrl}${endpoint}`
    console.log('API Call:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any required headers here
      },
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  },
  
  async post(endpoint: string, data?: unknown) {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  }
}

// Helper function to check if we're in development
export const isDevelopment = () => import.meta.env.DEV

// Helper function to get environment info
export const getEnvironmentInfo = () => ({
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  baseUrl: getApiBaseUrl(),
  nodeEnv: import.meta.env.VITE_NODE_ENV
})
