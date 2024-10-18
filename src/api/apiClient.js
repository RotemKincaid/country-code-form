import axios from 'axios'

let token = null

// token request 
const getAuthToken = async () => {
    try {
        const response = await axios.post('https://sandbox-api.softpoint.io/interface/v1/access_token', 
        {
            apiKey: '?????'
        })

        token = response.data.token

        return token
    } catch (error) {
        console.error('Error fetching auth token:', error)
        throw error
    }
}

// axios instance
const apiClient = axios.create({
    baseUrl: 'https://sandbox-api.softpoint.io/interface/v1',
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json'
    },
})



