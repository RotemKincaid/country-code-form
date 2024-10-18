import axios from 'axios'

// Initialize token
let token = null
let isFetchingToken = false // Flag to prevent multiple token requests

// Function to request authentication token
const getAuthToken = async () => {
    try {
        const response = await apiClient.post('/access_token', null, {
            headers: {
                'Api-Key': process.env.REACT_APP_API_KEY,
            },
            params: {
                corporate_id: 10
            },
        })

        token = response.data.access_token
        return token
    } catch (error) {
        console.error('Error fetching auth token:', error)
        throw new Error(error.message) // Rethrow the error with the message
    }
}

// Create Axios instance
const apiClient = axios.create({
    baseURL: 'https://sandbox-api.softpoint.io/interface/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add a request interceptor
apiClient.interceptors.request.use(
    async (config) => {
        // If no token is available, request a new one
        if (!token) {
            if (!isFetchingToken) {
                isFetchingToken = true // Set the flag to prevent duplicate requests
                try {
                    token = await getAuthToken() // Get a new token
                } catch (error) {
                    // Handle the error appropriately
                    console.error('Failed to fetch token:', error)
                    return Promise.reject(error) // Reject the request
                } finally {
                    isFetchingToken = false // Reset the flag
                }
            } else {
                // Optional handling (the case where a token fetch is already in progress)
            }
        }

        config.headers.Authorization = `Bearer ${token}`

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default apiClient
